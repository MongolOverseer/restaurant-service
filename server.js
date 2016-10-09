const express = require('express')
const bodyParser= require('body-parser')
const app = express()
// These are my own addings
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Templating engine
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('css'));

// Render index.ejs and fetch boroughs and cuisines for dropdown filter
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html')
  db.collection('restaurants').find({}, {cuisine: 1, borough: 1}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {restaurants: result});
  })
})

var url = 'mongodb://localhost:27017/test';
var db;

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.post('/restaurantssearched', (req, res) => {
  db.collection('restaurants').find({$text: {$search: req.body.query}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('resultsSearched.ejs', {restaurants: result})
  })
})

app.post('/restaurantsfiltered', (req, res) => {
  db.collection('restaurants').find({}, {cuisine: 1, borough: 1}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('resultsFiltered.ejs', {boroughsAndCuisines: result})
  })
})
