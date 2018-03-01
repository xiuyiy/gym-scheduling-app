var UserFactory = function(Schema,mongoose,connection, autoIncrement) {

    this.Schema = Schema;
    this.mongoose = mongoose;

    this.createUserSchema = function() {
        var UserSchema = new this.Schema({
            userId: { type: Number },
            createDate: { type: Date, default: new Date().getTime() },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            active: { type: Boolean, default: 0 },
            acceptionCode: { type: String, unique: true, required: true }
        });
        UserSchema.plugin(autoIncrement.plugin, 'User');
        this.User = connection.model('User', UserSchema);

        //this.User = UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId' });
    };

    this.getUser = function(query, res) {
        if (!query) {
            query = {};
        }
        var self = this;
        this.User.find(query, function(err, results){
            if (err) {
                res.status(404).send("not found");
            }
            if (results) {
                res.json(results);
            }
        });
    };

    this.insertSampleUser = function(req) {
        var newUser = new this.User({
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email
        });
        newUser.save();
    };

    this.insertUser = function(query, randomString) {
        var newUser = new this.User({
            firstName: query.firstName,
            lastName: query.lastName,
            email: query.email,
            acceptionCode: randomString
        });
        newUser.save();
    };

    this.acceptUser = function(query, res) {
        var keyword = {
            email: query.to,
            acceptionCode: query.emailcode
        };
        console.log(keyword);
        this.User.findOneAndUpdate(keyword, { $set: { active: 1 }}, {new: true}, function(err, output){
            if(err){
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
            if (output) {
                console.log("email is verified");
                res.end("<h1>Email is verified and now you can login now!</h1>");
            }
        });
    };
}

module.exports = UserFactory;
