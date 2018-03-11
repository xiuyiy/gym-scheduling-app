/**
 * Import node modules
 * @type {*|createApplication}
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var reservationFactory = require("./reservation.factory.js");
var userFactory = require("./user.factory.js");
var jwtService = require("./jwt.service.js");
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var autoIncrement = require('mongoose-auto-increment');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * Constant variables
 */

const saltRounds = 10;
const jwtKey = '10086';
var getDayFromDate = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

var jwtInfo = {
    key: jwtKey,
    module: jwt,
    getDayFromDate: getDayFromDate()
}

app.use(bodyParser.json());
app.use(function(req, res, next) {
    //set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var connection = mongoose.createConnection('mongodb://localhost/gym-schedule-1');
autoIncrement.initialize(connection);

var reservationFactory = new reservationFactory(Schema, mongoose, connection, autoIncrement, jwtInfo);
//create schemas
reservationFactory.createReservationSchema();
// reservationFactory.insertReservation({name:'minghe2',userId:11702, spotId:3});

var userFactory = new userFactory(Schema, mongoose, connection, autoIncrement, jwtInfo);
userFactory.createUserSchema();

var jwtService = new jwtService(jwtInfo);




/**
 * reservation APIs
 */
//http://localhost:3000/reservations?date=2018-03-10 --> get reservations given a day
//http://localhost:3000/reservations --> get all reservations
app.get('/reservations', function(req, res) {

    jwtService.validateJwt(req, res);

    var resp = reservationFactory.getReservations(req.query, res);
    // userFactory.getUsers({}, res);
});

app.post('/reservations', function(req, res) {

    console.log(req.body);
    jwtService.validateJwt(req, res);
    var resp = reservationFactory.insertReservation(req.body, res);
});

app.delete('/reservations', function (req, res) {

    console.log(req.query);
    jwtService.validateJwt(req, res);
    var resp = reservationFactory.deleteReservation(req.query, res);
})


//user APIs
/**
 * 1. passing nothing req.query={} will be passed to the db and all users will be returned
 * 2. passing ?_id=xxxx, user with _id==xxxx will be returned
 * 3. passing ?email=xxx@email.com, user with email address equals to xxx@email.com will be returned
 * ...
 */
app.get('/users', function(req, res) {

    //verify jwt
    jwtService.validateJwt(req, res);

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
app.post('/users', function(req, res) {

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
    if (!query || !query.email || !query.password) {
        res.status(400).json("missing parameters");
    }
    var output = userFactory.getUserByEmail(query.email);
    output.then(function(users) {
        if (!users || users.length == 0) { //user email is not correct
            res.status(401).json("user's email does not exist!");
        } else if (users.length > 1) {
            res.status(500).json("internal server error");
        } else if (!users[0].isActive) {
            res.status(401).json("user's account has not been activated!");
        } else {
            bcrypt.compare(query.password, users[0].password, function(err, result) {
                if (err) {
                    res.status(500).json("internal server error");
                }
                if (result) {
                    //res.status(200).json("login successfully.");
                    var token = userFactory.generateJwt();
                    var responseBody = {
                        token: token,
                        userId: users[0]._id,
                        email: users[0].email,
                        firstName: users[0].firstName,
                        lastName: users[0].lastName,
                    };
                    res.status(200).send(responseBody);
                }
            });
        }
    }).catch(function(error) {
        console.log(error);
        res.status(500).json("internal server error");
    });
});

// app.put('/users', function (req, res) {
//     var dbResult = factory.activateUser(req, res);
//     res.userFactory("User has been activated!");
// })

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "mstr.noreply@gmail.com",
        pass: "mstr123456"
    }
});
var rand, mailOptions, host, link;


var sendVerificationEmail = function(req, res) {
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?to=" + req.body.email + "&verificationCode=" + req.body.verificationCode;
    console.log(link);
    mailOptions = {
        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.accepted[0]);
            res.end("sent");
        }
    });
}


app.get('/verify', function(req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == "http://localhost:3000") {
        console.log("Domain is matched. Information is from Authentic email");
        userFactory.activateUser(req.query, res);
    } else {
        res.end("<h1>Request is from unknown source");
    }
});


/*--------------------Routing Over----------------------------*/

app.listen(3000);
console.log('Listening on port 3000...');
