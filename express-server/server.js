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
var gzippo = require('gzippo');

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
app.use(function (req, res, next) {
    //set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-AuthToken");
    //specify allowed methods
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// var connection = mongoose.createConnection('mongodb://localhost/gym-schedule-1');
var connection = mongoose.createConnection('mongodb://heroku_00cppzs1:753fki6rg1tnnfkjvucoasae4m@ds235609.mlab.com:35609/heroku_00cppzs1');


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
app.get('/reservations', function (req, res) {

    jwtService.validateJwt(req, res);

    if (req.query.returnUserInfo) {
        //?returnUserInfo=true to join collections to get all user info
        reservationFactory.getAllReservationsByDay(req.query.date)
            .then(function (output) {
                if (output) {
                    console.log(output);
                    res.status(200).json(output);
                }

            });
    }
    else {
        var resp = reservationFactory.getReservations(req.query, res);
    }
});

app.post('/reservations', function (req, res) {
    jwtService.validateJwt(req, res);
    getReservationGivenDayAndSpot(req)
    var resp = reservationFactory.insertReservation(req.body, res);
});

app.delete('/reservations', function (req, res) {

    console.log("This is delete");
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
app.get('/users', function (req, res) {

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
app.post('/users', function (req, res) {

    var verificationCode = randomstring.generate(18);

    var query = req.body;
    if (!query || !query.firstName || !query.lastName || !query.email || !query.password) {
        res.status(400).json("missing parameters");
    }
    //check to see if user already exists in the database first, otherwise no email will be sent
    var output = userFactory.getUserByEmail(query.email)
        .then(function (users) {
            if (users && users.length >= 1) {
                //this means the user already exists in the database and the acct. has been activated.
                if (users[0].isActive) {
                    //409 is conflict
                    res.status(409).send(users[0]);
                } else if (!users[0].isActive) {
                    //user registered but not activated.
                    res.status(409).send(users[0]);
                }
                //only sending out emails if the user does not exist in the database
            } else {
                query.verificationCode = verificationCode;
                bcrypt.hash(query.password, saltRounds, function (err, hash) {
                    if (err) {
                        res.status(500).json("internal server error");
                    }
                    if (hash) {
                        query.hashPwd = hash;
                        userFactory.insertUser(query, res);
                    }
                });
                sendVerificationEmail(req, res);
            }
        })

});

app.post('/login', function (req, res) {
    var query = req.body;
    console.log(query);
    if (!query || !query.email || !query.password) {
        res.status(400).json("missing parameters");
    }
    var output = userFactory.getUserByEmail(query.email);
    output.then(function (users) {
        if (!users || users.length == 0) { //user email is not correct
            res.status(401).json("The email address you provided does not exist!");
        } else if (users.length > 1) {
            res.status(500).json("internal server error");
        } else if (!users[0].isActive) {
            res.status(401).json("We have sent you an email with an activation link. It might be in the spam or junk folder. Please click on the verfication link to active your account!");
        } else {
            bcrypt.compare(query.password, users[0].password, function (err, result) {
                // result === true
                if (result) {
                    var token = userFactory.generateJwt();
                    var responseBody = {
                        token: token,
                        userId: users[0]._id,
                        email: users[0].email,
                        firstName: users[0].firstName,
                        lastName: users[0].lastName,
                        isAdmin: users[0].isAdmin,
                        isActive: users[0].isActive
                    };
                    res.status(200).send(responseBody);
                } else {
                    res.status(500).json("The password provided is incorrect!");
                }
            });
        }
    }).catch(function (error) {
        console.log(error);
        res.status(500).json("internal server error");
    });
});


var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "mstr.noreply@gmail.com",
        pass: "mstr123456"
    }
});
var rand, mailOptions, host, link;


var sendVerificationEmail = function (req, res) {
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?to=" + req.body.email + "&verificationCode=" + req.body.verificationCode;
    console.log(link);
    mailOptions = {
        to: req.body.email,
        subject: "Welcome to B.T. Labs!",
        html: "<html> <head> </head> <body>" +
        "<div>Hello there, "+ req.body.firstName + "!</div>" +
        "<p>We are so excited to welcome you into our community at B.T. Labs! </br>" +
        "To complete the last step of signing up, please click on the link below to activate your account! </br>" +
        "<div><a href=" + link + ">Click here to activate your account!</a></div>"
        + "</body></html>"
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


app.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == "http://env-89392-elb-2129585381.us-east-1.elb.amazonaws.com:3001") {
        console.log("Domain is matched. Information is from Authentic email");
        userFactory.activateUser(req.query, res);
    } else {
        res.end("<h1>Request is from unknown source");
    }
});


/*--------------------Routing Over----------------------------*/

app.use(express.static('../' + __dirname + '/login'));
console.log(__dirname);
// app.get('*', (req, res) =>{
//   res.sendFile(path.resolve(__dirname, '../login.html'));
// });
app.listen(process.env.PORT || 5000);
console.log('Listening on port' + process.env.PORT);
