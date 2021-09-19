"use strict" 

var express = require('express');
var router = express.Router();

const assert = require('assert');

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

        res.render('home', {title: 'Abschlussprojekt_Geosoft1SS21_Kujawa_Kaufmann', allsights: data, alltours: docs});
})})})})

module.exports = router;
