var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Factory = require("./module.factory.js");
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect('mongodb://localhost/gym-schedule-1');
var db = mongoose.connection;

var factory = new Factory(Schema,mongoose);
//create schemas
factory.createReservationSchema();
factory.createUserSchema();

//reservation APIs
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


//user APIs
app.get('/users', function (req, res) {
    var resp = factory.getUsers(req.query, res);
})

app.post('/users', function (req, res) {
    factory.insertUser(req.body, res);
    res.send("insert user success");

})

app.put('/users', function (req, res) {
    var dbResult = factory.activateUser(req, res);
    res.send("User has been actived!");
})





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
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/send',function(req,res){
    // rand=Math.floor((Math.random() * 100) + 54);
    rand = req.query.id;
    host=req.get('host');
    //req.id is the user index id
    link="http://"+req.get('host')+"/verify?id="+req.id;
    mailOptions={
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
     });
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host')) == ("http://"+host)) {
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
} else {
    res.end("<h1>Request is from unknown source");
}
});

/*--------------------Routing Over----------------------------*/

app.listen(3000);
console.log('Listening on port 3000...');
