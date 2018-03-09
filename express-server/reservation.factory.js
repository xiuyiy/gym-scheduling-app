var Factory = function(Schema, mongoose) {

    this.Schema = Schema;
    this.mongoose = mongoose;
    var jwt = require("jsonwebtoken");

    this.createReservationSchema = function() {
        var ReservationSchema = new this.Schema({
            date: String,
            name: String,
            employeeId: Number,
            spotId: Number
        });
        ReservationSchema.index({
            date: 1,
            spotId: 1,
            employeeId: 1
        }, {
            unique: true
        });
        this.Reservation = mongoose.model('Reservation', ReservationSchema);
    };

    this.getReservations = function(query, res) {
        this.Reservation.find(query, function(error, output) {
            if (error) {
                res.status(404).json("not found");
            }
            if(output) {
                res.json(output);
            }
        });
    };

    this.insertReservation = function(req) {
        var reservation = new this.Reservation({
            date: req.date,
            name: req.name,
            employeeId: req.employeeId,
            spotId: req.spotId
        });
        console.log(reservation);
        reservation.save();
    };
    this.deleteReservation = function(query, res) {
        this.Reservation.delete(query, fun)
    };

    this.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000),
        }, "10086"); // DO NOT KEEP YOUR SECRET IN THE CODE!
    };
}

module.exports = Factory;
