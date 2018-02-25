var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Factory = require("./module.factory.js");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect('mongodb://localhost/gym-schedule-1');
var db = mongoose.connection;

var factory = new Factory(Schema,mongoose);
factory.createReservationSchema();

app.get('/ping', function(req, res) {
    res.send({ping:'hello this is server and I am alive!'});
});

app.get('/reservations', function(req, res) {
    var resp = factory.getReservations({date:req.query.date}, res);
});

app.post('/reservations', function(req, res) {
    console.log(req.body);
    var resp = factory.insertReservation(req.body, res);
});

app.listen(3000);
console.log('Listening on port 3000...');
