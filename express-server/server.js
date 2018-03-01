var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var reservationFactory = require("./module.factory.js");
var userFactory = require("./user.factory.js")
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var autoIncrement = require('mongoose-auto-increment');
var randomstring = require("randomstring");

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var connection = mongoose.createConnection('mongodb://localhost/gym-schedule-1');
autoIncrement.initialize(connection);

var reservation = new reservationFactory(Schema, mongoose);
var user = new userFactory(Schema, mongoose,connection, autoIncrement);

reservation.createReservationSchema();
user.createUserSchema();
// reservation.insertSample();
// user.insertSampleUser();

app.get('/ping', function(req, res) {
    res.json('hello this is server and I am alive!');
});

app.get('/reservations', function(req, res) {
    console.log(req.query);
    debugger;
    var resp = reservation.getReservations({
        date: req.query.date
    }, res);
});

app.post('/reservations', function(req, res) {
    console.log(req.body);
    debugger;
    var resp = reservation.insertReservation(req.body, res);
});


app.post('/users', function(req, res) {
    var query = {
        "email": req.body.email
    };
    var ranstr = randomstring.generate(18);
    // try {
    user.insertUser(req.body, ranstr);
    // } catch (
    //     res.status(409).json("This user is already registered!");
    // )
    sendConfirmationEmail(req, ranstr, res);
});

app.get('/users', function(req, res) {
    user.getUser(req.query, res);
});

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "mstr.noreply@gmail.com",
        pass: "mstr123456"
    }
});
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

var sendConfirmationEmail = function(req, code, res) {

    host = req.get('host');
    link="http://"+req.get('host')+"/verify?to="+req.body.email+"&emailcode="+code;
    mailOptions = {
        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
            console.log("Message sent: " + response.accepted[0]);
        }
    });
    res.status(200).send("Thanks for Sign up. An email has been sent to you for verification.");
};

app.get('/verify', function(req, res) {
    console.log(req.protocol + "://" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == "http://localhost:3000") {
        console.log("Domain is matched. Information is from Authentic email");
        user.acceptUser(req.query, res);
        /*
        if (req.query.id == rand) {
            console.log("email is verified");
            res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
        } else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }*/
    } else {
        res.end("<h1>Request is from unknown source");
    }
});


/*--------------------Routing Over----------------------------*/

app.listen(3000);
console.log('Listening on port 3000...');
