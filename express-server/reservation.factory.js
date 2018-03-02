var Factory = function (Schema, mongoose) {

    this.Schema = Schema;
    this.mongoose = mongoose;

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
        var time = new this.Reservation({
            date: req.date,
            name: req.name,
            employeeId: req.employeeId,
            spotId: req.spotId
        });
        time.save();
    };
    this.deleteReservation = function (query, res) {
        this.Reservation.delete(query, fun)
    }


}

module.exports = Factory;
