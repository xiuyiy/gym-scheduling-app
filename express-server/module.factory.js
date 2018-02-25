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
            index: Number
        });
        ReservationSchema.index({ date: 1, index: 1}, { unique: true });
        this.Reservation = mongoose.model('Reservation', ReservationSchema);
    };

    this.getReservations = function(query,res) {
        this.Reservation.find(query,function(error,output) {
            res.json(output);
        });
    };

    this.insertReservation = function(req) {
        var time = new this.Reservation({
            date: req.date,
            name: req.name,
            employeeId: req.employeeId,
            index: req.index
        });
        time.save();
    };

    this.insertSample = function() {
        var time = new this.Reservation({
            date: "12345",
            name: "Ming",
            employeeId: 11702,
            index: 2
        });
        time.save();
    };

}

module.exports = Factory;
