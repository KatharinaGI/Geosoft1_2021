//Javascript for Uebung_6
//author: Thomas Kujawa, Katharina Kaufmann
//Source: https://closebrace.com/tutorials/2017-03-02/creating-a-simple-restful-web-app-with-nodejs-express-and-mongodb

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Uebung6_Kujawa_Kaufmann' });
});

module.exports = router;
