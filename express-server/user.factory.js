var userFactory = function(Schema, mongoose, connection, autoIncrement, jwtInfo) {

    this.Schema = Schema;
    this.mongoose = mongoose;

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
        //removed auto index increment as this seems to break join. ObjectId accepts a 24-length-long hex string
        // UserSchema.plugin(autoIncrement.plugin, 'User');
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

    this.getUserByEmail = function(email, res) {
        var query = {
            "email": email
        };
        // return this.User.find(query).exec();
        return this.User.findOne(query, function (error, output) {
            if(error) { res.status(500).json("internal server error");}
            if(output) {
                return output;
            }
        });
    };

    this.insertUser = function(requestBody, res) {

        var newUser = new this.User({
            email: requestBody.email,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            password: requestBody.hashPwd,
            verificationCode: requestBody.verificationCode,
            isAdmin: requestBody.isAdmin
        });
        newUser.save(function(err, result){
            if (err) {
                res.status(400).send(err.message);
            }
            if (result) {
                console.log(result);
                res.status(200).send("Succssfully reserve the spot!");
            }
        });
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
                        "Location": "http://env-89392-elb-2129585381.us-east-1.elb.amazonaws.com:8082/#!/login"
                    }
                );
                res.end();
            }
        })
    };

    this.generateJwt = function() {
        var expiry = Math.floor(Date.now() / 1000) + (60 * 60);

        return jwtInfo.module.sign({
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: expiry,
        }, jwtInfo.key); // DO NOT KEEP YOUR SECRET IN THE CODE!
    };
};

module.exports = userFactory;
