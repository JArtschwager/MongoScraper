var express = require("express");
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require("path")
var mongoose = require("mongoose");
var request = require("request");

var axios = require("axios");
var cheerio = require("cheerio");
// Require all models Crafts and Note.
var db = require("./models");

// * add in the env for heroku
var PORT = process.env.PORT || 3000;

//connecting to the mongoDB for heroku vs local.
var databaseURL = "mongodb://localhost/craftDB";

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseURL);
}

var app = express();

console.log("\n***********************************\n" +
  "Grabbing every thread name and link\n" +
  "from Country Living's craft list:" +
  "\n***********************************\n");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB //* see if this is connected correctly?
// mongoose.connect("mongodb://localhost/craftDB");

// * do not touch anything about this line//

// * DO I NEED A GENERAL APP.GET?
// app.get("/", function(req, res) {
//   console.log('local host go!');
// })  



//*WORKING TO GET THE SCRAPE TO THE DB
          app.get("/scrape", function (req, res) {
            request("https://www.countryliving.com/diy-crafts/", function (error, response, html) {
              // Load the HTML into cheerio and save it to a variable
              var $ = cheerio.load(html);
              //holds data
              var results = [];
   
              $("div.full-item").each(function (i, element) {
                var title = $(element).find('div.full-item-content > .full-item-title').text().trim();
                var link = $(element).find('div.full-item-content > .full-item-title').attr("href");
                // results.push({
                //     title: title,
                //     link: ('https://www.countryliving.com' + link)

                db.Crafts.insert({
                    title: title,
                    link: ('https://www.countryliving.com' + link)
                  },
                  function (err, inserted) {
                    if (err) {
                      // Log the error if one is encountered during the query
                      console.log(err);
                    } else {
                      // Otherwise, log the inserted data
                      console.log(inserted);
                    }
                  })
              })
              //this has to be here to end the request.
              res.send("Scrape Complete");
            });
          });

          //*WORKING TO GET ALL CRAFTS DISPLAYED
          app.get("/all", function (req, res) {
            // Find all results from the craft collection in the db
            db.Crafts.find({}, function (error, found) {
              // Throw any errors to the console
              if (error) {
                console.log(error);
              }
              //  send data to the browser as json
              else {
                res.json(found);
              }
            });
            console.log("successfully grabbed all");
          });


          // Route for grabbing a specific Article by id, populate it with it's note
          app.get("/all/:id", function (req, res) {
            //match the DB
            db.Crafts.findOne({
                _id: req.params.id
              })
              //*error logs here. 
              .populate("notes")
              .then(function (dbArticle) {
                res.json(dbArticle);
              })
              .catch(function (err) {
                res.json(err);
              });
          });


          //*below not tested yet if working - no boxes have appeared yet.
          // Route for saving/updating a craft and note
          app.post("/all/:id", function (req, res) {
            // Create a new note and pass the req.body to the entry
            db.Note.create(req.body)
              .then(function (dbNote) {
                //find by id - update craft with note.
                return db.Crafts.findOneAndUpdate({
                  _id: req.params.id
                }, {
                  note: dbNote._id
                }, {
                  new: true
                });
              })
              .then(function (dbArticle) {
                res.json(dbArticle);
              })
              .catch(function (err) {
                res.json(err);
              });
          });


      //trying to grab all of the notes to make sure the connection is working
      app.get("/allNotes", function (req, res) {
        // Find all results from the craft collection in the db
        db.Note.find({}, function (error, found) {
          // Throw any errors to the console
          if (error) {
            console.log(error);
          }
          //  send data to the browser as json
          else {
            res.json(found);
          }
        });
        console.log("successfully grabbed all");
      });



app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});