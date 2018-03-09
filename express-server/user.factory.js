var userFactory = function(Schema, mongoose, connection, autoIncrement) {

    this.Schema = Schema;
    this.mongoose = mongoose;
    var jwt = require("jsonwebtoken");

    //create a schema, each schema maps to a mongodb collection and defines the shape of the documents within that collection
    this.createUserSchema = function() {
        var UserSchema = new this.Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            isActive: {
                type: Boolean,
                default: false
            },
            creationDate: {
                type: Date,
                default: Date.now()
            },
            activatedDate: {
                type: Date
            },
            isAdmin: {
                type: Boolean,
                default: false
            },
            verificationCode: {
                type: String
            }
        });
        //create a model
        // this.User = mongoose.model('User', UserSchema);
        UserSchema.plugin(autoIncrement.plugin, 'User');
        UserSchema.index({
            _id: 1
        }, {
            unique: true
        });
        this.User = connection.model('User', UserSchema);
    };

    this.getUsers = function(query, res) {
        this.User.find(query, function(error, output) {
            res.json(output);
        });
    };

    this.getUserByEmail = function(keyword) {
        var query = {
            "email": keyword
        };
        return this.User.find(query).exec();
    };

    this.insertUser = function(requestBody, res) {

        var newUser = new this.User({
            email: requestBody.email,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            password: requestBody.hashPwd,
            verificationCode: requestBody.verificationCode
        });
        newUser.save();
    };

    this.deleteUser = function(req, res) {
        this.User.delete(req.query._id, function(error, res) {
            if (error) return res.send(error);
            res.send(res);
        });
    };

    this.activateUser = function(req, res) {

        var keyword = {
            email: req.to,
            verificationCode: req.verificationCode
        };

        this.User.findOneAndUpdate(keyword, {
            $set: {
                isActive: true,
                activatedDate: Date.now()
            }
        }, function(error, result) {
            if (error) {
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
            if (result) {
                console.log("email is verified");
                res.status(302);
                res.header({
                        "Location": "http://localhost:8082/index.html#!/login"
                    }
                );
                res.end();
            }
        })
    };

    this.generateJwt = function() {
        var expiry = Math.floor(Date.now() / 1000) + (60 * 60);

        return jwt.sign({
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: expiry,
        }, "10086"); // DO NOT KEEP YOUR SECRET IN THE CODE!
    };
};

module.exports = userFactory;
