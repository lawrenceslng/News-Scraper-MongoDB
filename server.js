// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
/*
  cheerio takes the html from the request and let's you use jQuery like syntax to access particular text inside of it
*/
var cheerio = require("cheerio");
// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "NewsScraper";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/",function(req,res){
    res.send("Hello World");
});

// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });