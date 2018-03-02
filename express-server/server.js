var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var reservationFactory = require("./reservation.factory.js");
var userFactory = require("./user.factory.js");
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var autoIncrement = require('mongoose-auto-increment');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(function(req, res, next) {
    //set CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// mongoose.connect('mongodb://localhost/gym-schedule-1');
// var db = mongoose.connection;

var connection = mongoose.createConnection('mongodb://localhost/gym-schedule-1');
autoIncrement.initialize(connection);

var reservationFactory = new reservationFactory(Schema, mongoose);
//create schemas
reservationFactory.createReservationSchema();

var userFactory = new userFactory(Schema, mongoose, connection, autoIncrement);
userFactory.createUserSchema();

//reservation APIs
app.get('/reservations', function(req, res) {
    var resp = reservationFactory.getReservations({date:req.query.date}, res);
});

app.post('/reservations', function(req, res) {
    console.log(req.body);
    var resp = reservationFactory.insertReservation(req.body, res);
});


//user APIs
/**
 * 1. passing nothing req.query={} will be passed to the db and all users will be returned
 * 2. passing ?_id=xxxx, user with _id==xxxx will be returned
 * 3. passing ?email=xxx@email.com, user with email address equals to xxx@email.com will be returned
 * ...
 */
app.get('/users', function (req, res) {
    userFactory.getUsers(req.query, res);
})

/**
 * Create new user and insert it into database, sending out verification email
 */
/*
POST register
body required
{
    email: String,
    password: String,
    firstName: String,
    lastName: String,
}
*/
app.post('/users', function (req, res) {

    var verificationCode = randomstring.generate(18);

    var query = req.body;
    if (!query || !query.firstName || !query.lastName || !query.email || !query.password) {
        res.status(400).json("missing parameters");
    }
    query.verificationCode = verificationCode;
    bcrypt.hash(query.password, saltRounds, function(err, hash) {
        if (err) {
            res.status(500).json("internal server error");
        }
        if (hash) {
            query.hashPwd = hash;
            userFactory.insertUser(query, res);
        }
    });
    sendVerificationEmail(req, res);
});

app.post('/login', function(req, res) {
    var query = req.body;
    if (!query || !query.email|| !query.password) {
        res.status(400).json("missing parameters");
    }
    var output = userFactory.getUserByEmail(query.email);
    output.then(function(users){
        console.log(users);
        if (!users || users.length == 0) { //user email is not correct
            res.status(401).json("user email or password is not correct.");
        } else {
            bcrypt.compare(query.password, users[0].password, function(err, result) {
                if (err) {
                    res.status(500).json("internal server error");
                }
                if (result) {
                    res.status(200).json("login Successfully!");
                } else { //password is not matched.
                    res.status(401).json("user email or password is not correct.");
                }
            });
        }
    }).catch(function(error){
        console.log(error);
        res.status(500).json("internal server error");
    });
});

// app.put('/users', function (req, res) {
//     var dbResult = factory.activateUser(req, res);
//     res.userFactory("User has been activated!");
// })



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


var sendVerificationEmail = function (req, res) {
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?to=" + req.body.email + "&verificationCode=" + req.body.verificationCode;
    mailOptions = {
        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.accepted[0]);
            res.end("sent");
        }
    });
}


app.get('/verify',function(req, res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host')) == "http://localhost:3000") {
    console.log("Domain is matched. Information is from Authentic email");
    userFactory.activateUser(req.query, res);
} else {
    res.end("<h1>Request is from unknown source");
}
});


/*--------------------Routing Over----------------------------*/

app.listen(3000);
console.log('Listening on port 3000...');
