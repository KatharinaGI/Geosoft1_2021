//Javascript for Uebung_6
//author: Thomas Kujawa, Katharina Kaufmann
//Source: https://closebrace.com/tutorials/2017-03-02/creating-a-simple-restful-web-app-with-nodejs-express-and-mongodb


var express = require('express');
var router = express.Router();

/* GET routelist. */
router.get('/routelist', function(req, res) {
  var db = req.db;
  var collection = db.get('routelist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to addroute. */
router.post('/addroute', function(req, res) {
  var db = req.db;
  var collection = db.get('routelist');
  collection.insert(req.body, function(err){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deleteroute. */
router.delete('/deleteroute/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('routelist');
  var routeToDelete = req.params.id;
  collection.remove({ '_id' : routeToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;