var Factory = function(Schema,mongoose) {

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

    this.createReservationSchema = function() {
        var ReservationSchema = new this.Schema({
            date: String,
            name: String,
            employeeId: Number,
            spotId: Number
        });
        ReservationSchema.index({ date: 1, spotId: 1, employeeId: 1}, { unique: true });
        this.Reservation = mongoose.model('Reservation', ReservationSchema);
    };

    this.getReservations = function(query,res) {
        this.Reservation.find(query,function(error,output) {
            res.json(output);
        });
    };

    this.insertReservation = function(req,res) {
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
}

module.exports = Factory;
