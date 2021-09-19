"use strict"

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('impressum', { title: 'Impressum' });
});

module.exports = router;
