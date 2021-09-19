"use strict"

const express = require('express');
const router = express.Router();

const assert = require('assert')

//Found multer for the easy use of the uploaded data
//Source: https://www.npmjs.com/package/multer
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//Found axios when I was looking for an alternative to jquery that was throwing errors:
//Sources: https://www.npmjs.com/package/axios
const axios = require('axios');

// Database
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; 
const url = 'mongodb://mongo:27017'; //connection URL
const client = new MongoClient(url); //create mongodb client
const dbName = 'finalproject' 
const sightsCollection = 'sights'; //name of sights-database
const citytourCollection = 'citytours'; //name of citytours-database

 
/* GET all sights and tours. */
router.get('/', function(req, res, next) {
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected successfully to the server");

    const db = client.db(dbName);
    const sightscollection = db.collection(sightsCollection);
    const tourscollection = db.collection(citytourCollection);

    //Find all database entries
    sightscollection.find({}).toArray(function(err, data){ //Source: https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp
      assert.equal(null,err);
      console.log("The following entries were found for attractions:");
      console.log(data)

      tourscollection.find({}).toArray(function(err, docs){ //Source: https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp
        assert.equal(null,err); 
        console.log("The following entries were found for tours:");
        console.log(docs)

        res.render('edit', {title: 'Edit', allsights: data, alltours: docs});
})})})})



/* POST to addsight. */
router.post('/addsight', function(req, res) {
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected succesfully to the server");

    const db = client.db(dbName);
    const collection = db.collection(sightsCollection);
    var givendata = req.body.sight; //Take passed data
    var useddata = JSON.parse(givendata); //parse passed data
    //Check the data
    console.log(useddata);
    
    //Add data to database
    collection.insertOne(useddata, function(err, result){
      assert.equal(null,err);
      console.log(`Inserted ${result.insertedCount} documents into the collection`);
      //Back to the edit page
      res.redirect('/edit')
    })
  })});

/* POST to addsightviatextfield */
//Source: https://www.npmjs.com/package/multer
router.post('/addsightviatextfield', upload.none('textfield'), function(req,res){
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected succesfully to the server");

    const db = client.db(dbName);
    const collection = db.collection(sightsCollection);

    //Take passed data
    var text = req.body;
    //Check the data
    console.log(text);
    console.log(text.textfield);

    //Read the inserted data/Check if data is found.
    if (text == undefined){
      res.send("There has been an error. The data you are looking for is not defined. Check the entry and send it again if necessary.")}
      else {
        //Check whether the data entered is valid
        try {
          var textToJSON = JSON.parse(text.textfield);
          //Check the data
          console.log(textToJSON);
        }
        //If not: send message.
        catch {
          res.send("The format you entered is not valid. Please make sure that the data is in GeoJSON format.")
          return false;
        }
        //Verify that the uploaded file is of the correct type. 
        if (textToJSON.type != "FeatureCollection"){
          res.send("The uploaded JSON-File is not of the type FeatureCollection. Please adjust the type.")}
          else {
            //Verify that the uploaded file is of the correct geometry type.
            if(textToJSON.features[0].geometry.type != "Point" && textToJSON.features[0].geometry.type != "Polygon"){
              res.send("The type of geometry used is not permitted. Please use the types point and polygon.")}
            else{
                //Edit the description for the point of interest before adding it to the database.
                //If the URL contains "wikipedia.org", the description will be filled with a requested Wikipedia description.
                if(textToJSON.features[0].properties.URL.includes("wikipedia.org")){
                  var sightsName = getTitle(textToJSON.features[0].properties.URL);
                  console.log(sightsName);

                  //Found axios when I was looking for an alternative to jquery that was throwing errors:
                  //Sources: https://www.npmjs.com/package/axios, https://www.digitalocean.com/community/tutorials/how-to-write-asynchronous-code-in-node-js-de
                  axios({
                    method: 'GET',
                    url: 'http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + sightsName + '&origin=*',
                    responseType: 'jsonp'})
                    .then(function (response){
                      var key = Object.keys(response.data.query.pages)[0];
                      var article = response.data.query.pages[key].extract;
                      console.log(article);
                      textToJSON.features[0].properties.Beschreibung = article;
                      console.log(textToJSON.features[0].properties);})
                    .then(() => {
                      //Add data to database
                      collection.insertOne(textToJSON, function (err, result){
                        if(err){
                          //If error: send error message
                          res.send("An error occurred while adding the point of interest to the database.")}
                          else{
                            assert.equal(null,err);
                            console.log(`Inserted ${result.insertedCount} documents into the collection`);
                            res.redirect('/edit')}})})
                    }
                else{
                  //If the URL does not include "wikipedia.org", the description will be set to "Keine Informationen vorhanden."
                  if(textToJSON.features[0].properties.Beschreibung == ""){
                     textToJSON.features[0].properties.Beschreibung = "Keine Informationen vorhanden."
                     console.log(textToJSON.features[0].properties.Beschreibung);

                     //Add data to database
                     collection.insertOne(textToJSON, function (err, result){
                      if(err){
                         //If error: send error message
                        res.send("An error occurred while adding the point of interest to the database.")}
                        else{
                          assert.equal(null,err);
                          console.log(`Inserted ${result.insertedCount} documents into the collection`);
                           //Back to the edit page
                           res.redirect('/edit')}})
                }}
}}}})});


/* POST to addsightviaInputFile */
//Source: https://www.npmjs.com/package/multer
router.post('/addsightviaInputFile', upload.single('inputfile'), function(req,res){
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected succesfully to the server");

    const db = client.db(dbName);
    const collection = db.collection(sightsCollection);

    //Take passed data
    var storedInMulter = req.file;
   
    //Check the data
    console.log(storedInMulter);

    //Read the inserted data/Check if data is found.
    if (storedInMulter == undefined){
      res.send("There has been an error. The data you are looking for is not defined. Please check youre entry.")}
      else {
        if(isGeoJSON(storedInMulter.originalname) != true){
          res.send("The inserted file is not of the .geojson type. Please check your entry.")}
        else{
        //Check whether the data entered is valid
          try {
          var fileToJSON = JSON.parse(storedInMulter.buffer);
          //Check the data
          console.log(fileToJSON);
        }
        //If not: send message.
        catch {
          res.send("The format you entered is not valid. Please make sure that the file is in GeoJSON format.")
        }
        //Verify that the uploaded file is of the correct type. 
        if (fileToJSON.type != "FeatureCollection"){
          res.send("The uploaded JSON-File is not of the type FeatureCollection. Please adjust the type.")}
          else {
            //Verify that the uploaded file is of the correct geometry type.
            if (fileToJSON.features[0].geometry.type != "Point" && fileToJSON.features[0].geometry.type != "Polygon"){
              res.send("The type of geometry used is not permitted. Please use the types point and polygon.")}
              else{
                
                //Edit the description for the point of interest before adding it to the database.
                //If the URL contains "wikipedia.org", the description will be filled with a requested Wikipedia description.
                if(fileToJSON.features[0].properties.URL.includes("wikipedia.org")){
                  var sightsName = getTitle(fileToJSON.features[0].properties.URL);
                  console.log(sightsName);

                  //Found axios when I was looking for an alternative to jquery that was throwing errors
                  //Sources: https://www.npmjs.com/package/axios, https://www.digitalocean.com/community/tutorials/how-to-write-asynchronous-code-in-node-js-de
                  axios({
                    method: 'GET',
                    url: 'http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + sightsName + '&origin=*',
                    responseType: 'jsonp'})
                    .then(function (response){
                      var key = Object.keys(response.data.query.pages)[0];
                      var article = response.data.query.pages[key].extract;
                      console.log(article);
                      fileToJSON.features[0].properties.Beschreibung = article;
                      console.log(fileToJSON.features[0].properties);})
                    .then(() => {
                      //Add data to database
                      collection.insertOne(fileToJSON, function (err, result){
                        if(err){
                          //If error: send error message
                          res.send("An error occurred while adding the point of interest to the database.")}
                          else{
                            assert.equal(null,err);
                            console.log(`Inserted ${result.insertedCount} documents into the collection`);
                            res.redirect('/edit')}})
                      })
                    }
                else{
                  //If the URL does not include "wikipedia.org", the description will be set to "Keine Informationen vorhanden."
                   if(fileToJSON.features[0].properties.Beschreibung == ""){
                      fileToJSON.features[0].properties.Beschreibung = "Keine Informationen vorhanden."
                      console.log(fileToJSON.features[0].properties.Beschreibung);

                      //Add data to database
                      collection.insertOne(fileToJSON, function (err, result){
                        if(err){
                          //If error: send error message
                          res.send("An error occurred while adding the point of interest to the database.")}
                          else{
                            assert.equal(null,err);
                            console.log(`Inserted ${result.insertedCount} documents into the collection`);
                            //Back to the edit page
                            res.redirect('/edit')}})
                  }}
                 
    }}}}})});                   
                   
                    
/* POST to delete sight. */
router.post('/deleteSight', function(req, res) {
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected succesfully to the server"); 

    const db = client.db(dbName);
    const collection = db.collection(sightsCollection);
    
    var sightsToDelete = JSON.parse(req.body.sightstodelete); //parse passed data
    
    //Delete every object from sightsToDelete from the database
    if (sightsToDelete.sights.length > 0) {
      for (var i=0; i<sightsToDelete.sights.length; i++) {
        var nextsight = {"_id": mongodb.ObjectId(sightsToDelete.sights[i])}
        collection.deleteOne(nextsight, function(err, result){
            assert.equal(err, null);
            console.log('One document deleted');
        })
      }  
    //Back to the edit page
    res.redirect('/edit')
    }
})});

router.post('/addTour',function(req, res, next) {
  client.connect(async function(err){
    assert.equal(null, err);
    console.log("Connected succesfully to the server")

    const db = client.db(dbName);
    const sightscollection = db.collection(sightsCollection);
    const tourscollection = db.collection(citytourCollection);
    
    var cityguide = JSON.parse(req.body.tourtoadd); //parse passed data

    var tour = [];

    //Search every object from cityguide in the sightcollection 
    for (let i = 0; i < cityguide.items.length; i++) {
      var sighttofind = {"_id": mongodb.ObjectId(cityguide.items[i])};
      console.log(sighttofind);
      let stopover = await sightscollection.findOne(sighttofind);
      console.log(stopover);
      tour.push(stopover);
    }
    console.log(tour);

    //Generate JSON from data
    var newtour = {"name": cityguide.name, "items": tour};

    //Add tour to database
    tourscollection.insertOne(newtour, function(err, result){
       assert.equal(err, null);  
       console.log(`Inserted ${result.insertedCount} documents into the collection`);
       //Back to the edit page
       res.redirect('/edit');
    })})
})

/* POST to delete tour. */
router.post('/deleteTour', function(req, res) {
  client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected succesfully to the server"); 

    const db = client.db(dbName);
    const collection = db.collection(citytourCollection);
    
    var toursToDelete = JSON.parse(req.body.tourstodelete); //parse passed data
    
    //Delete every object from tourToDelete from the database
    if (toursToDelete.tours.length > 0) {
      for (var i=0; i<toursToDelete.tours.length; i++) {
        var nexttour = {"_id": mongodb.ObjectId(toursToDelete.tours[i])}
        collection.deleteOne(nexttour, function(err, data)
        {
            assert.equal(err, null);
            console.log('One document deleted');
            
        })}}
    //Back to the edit page
    res.redirect('/edit')
    }
)});
  

//Auxiliary functions

/**
 * Separates the passed Url after the 4th "/" and returns the separated end as the title
 * Source: https://www.w3schools.com/jsref/jsref_split.asp
 * @param {string} url 
 * @returns title
 */
 function getTitle(url){
  var split = url.split('/');
  var title = split[4];
  return title;
}

/**
 * Separates the file name at the point and checks whether the second part is ".geojson"
 * Source: https://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript/680982
 * @param {string} filename 
 * @returns boolean true or false
 */
function isGeoJSON(filename){
  var ending =  filename.split('.').pop();
  if(ending == "geojson"){
    return true
  }
  else{
    return false;
  }
}

module.exports = router;