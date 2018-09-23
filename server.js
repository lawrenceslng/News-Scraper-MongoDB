// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var path = require("path");
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

db.on('connect', function () {
	console.log('database connected')
})

app.get("/",function(req,res){
    res.send("Hello World");
});

app.get("/bay_area_news", function(req,res){
// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every headline\n" +
            "from SF Chronicle news board:" +
            "\n***********************************\n");
var results = [];
// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://www.sfchronicle.com/local/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  

  // 
  // (i: iterator. element: the current element)
  $(".headline").each(function(i, element) {
    // console.log(element);
    // Save the text of the element in a "title" variable
    var title = $(element).children().text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");
    var summary = $(element).parent().children(".blurb").text().trim();
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      summary: summary
    });
    db.articles.insert({tite:title,link: link,
      summary: summary})
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
res.sendFile(path.join(__dirname, '/public/results.html'));

});

app.get("/database",function(req,res){
  db.articles.find({}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    else {
      // Otherwise, send the result of this query to the browser
      res.json(data);
    }
  });
})
// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });