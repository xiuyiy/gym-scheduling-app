var Factory = function (Schema, mongoose) {

    this.Schema = Schema;
    this.mongoose = mongoose;
    this.Item = null;
    /*
        this.createClassSchemas = function() {

            var ClassSchema = new this.Schema({
                className: String,
                classDate: String,
                coachName: String,
                totalNumber: Number,
                times: []
            });

            this.Class = mongoose.model('Class',ClassSchema);
        };

        this.insertClass = function(className, date, coach, totalNumber) {
            var newClass = new this.Class({
                className: className,
                classDate: date,
                coachName: coach,
                totalNumber: totalNumber
            });
            newClass.save();
        };
    */

    this.createReservationSchema = function () {
        var ReservationSchema = new this.Schema({
            date: String,
            name: String,
            employeeId: Number,
            spotId: Number
        });
        ReservationSchema.index({date: 1, spotId: 1, employeeId: 1}, {unique: true});
        this.Reservation = mongoose.model('Reservation', ReservationSchema);
    };

    this.getReservations = function (query, res) {
        this.Reservation.find(query, function (error, output) {
            res.json(output);
        });
    };

    this.insertReservation = function (req, res) {
        console.log(req.spotId);
        var time = new this.Reservation({
            date: req.date,
            name: req.name,
            employeeId: req.employeeId,
            spotId: req.spotId.toString()
        });
        time.save();
        res.send("successfully insert " + req.name);
    };
    this.deleteReservation = function (query, res) {
        this.Reservation.delete(query, fun)
    }

    //create a schema, each schema maps to a mongodb collection and defines the shape of the documents within that collection
    this.createUserSchema = function () {
        var UserSchema = new this.Schema({
            email: {type: String, unique: true},
            firstName: String,
            lastName: String,
            password: String,
            isActive: Boolean,
            creationDate: {type: Date, default: Date.now()},
            activatedDate: Date
        });
        //create a model
        this.User = mongoose.model('User', UserSchema);
    }

    this.getUsers = function (query, res) {
        this.User.find(query, function (error, output) {
            res.json(output);
        });
    };

    this.insertUser = function (requestBody, res) {

        if (requestBody.isActive !== true) {
            requestBody.isActive = false;
        }
        var newUser = new this.User({
            email: requestBody.email,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            password: requestBody.password,
            isActive: requestBody.isActive
        });
        newUser.save();
        res.send("successfully inserted new user " + requestBody.firstName + " " + requestBody.lastName);
    }

    this.deleteUser = function (req, res) {
        this.User.delete(req.query._id, function (error, res) {
            if(error) return res.send(error);
            res.send(res);
        })
    }

    this.activateUser = function (req, res) {
        console.log(req.query._id);
        this.User.findByIdAndUpdate(req.query._id, {
            $set: {
                isActive: true,
                activatedDate: Date.now()
            }
        }, function (error, res) {
            if (error) return res.status(500).send(error);
            return res;
        })
    };
}

module.exports = Factory;
