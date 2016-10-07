MONGO:

Create indexes on fields borough and cuisine:

db.restaurants.createIndex(
   {
     borough: "text",
     cuisine: "text"
   },
   {
	"weights": { cuisine: 2, borough:1 }
   }
 )

Test indexes:

//Doesn't return restaurant with borough: brooklyn and cuisine: hamburgers..
db.restaurants.find({$text: {$search: "hamburgers brooklyn"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

db.restaurants.find({$text: {$search: "hamburgers brooklyn"}}).explain(true)
db.restaurants.find({$text: {$search: "\"hamburgers bronx\""}})



NODE.JS:

Prequisites:

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

Import the restaurants dataset:
mongoimport --db test --collection restaurants --drop --file primer-dataset.json

Define findRestaurants function:

var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find({ "borough": "Manhattan", "cuisine": "Italian"});
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

Call the find restaurants function:

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(db, function() {
      db.close();
  });
});
