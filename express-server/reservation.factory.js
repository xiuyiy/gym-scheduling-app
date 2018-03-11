var Factory = function (Schema, mongoose, connection, autoIncrement, jwtInfo) {

    this.Schema = Schema;
    this.mongoose = mongoose;

    this.createReservationSchema = function () {
        var ReservationSchema = new this.Schema({
            date: {
                type: String
            },
            classId: {
                type: Number
            },
            userId: {
                type: Number
            },
            spotId: {
                type: Number
            }
        });
        ReservationSchema.plugin(autoIncrement.plugin, 'Reservation');
        ReservationSchema.index({
            // date: 1,
            // spotId: 1,
            // userId: 1
            _id: 1
        }, {
            unique: true
        });
        this.Reservation = connection.model('Reservation', ReservationSchema);
    };

    this.getReservations = function (query, res) {
        this.Reservation.find(query, function (error, output) {
            if (error) {
                res.status(404).json("not found");
            }
            if (output) {
                res.json(output);
            }
        });
    };

    this.insertReservation = function (req) {
        var reservation = new this.Reservation({
            date: jwtInfo.getDayFromDate,
            classId: req.classId,
            userId: req.userId,
            spotId: req.spotId
        });

       reservation.save();
    };

    this.deleteReservation = function (query, res) {
        this.Reservation.findOneAndRemove(query, function (error, output) {
            if (error) {
                res.status(500).json("deletion failed");
            }
            if (output) {
                res.status(204);
            }
        })
    };

    this.generateJwt = function () {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwtInfo.module.sign({
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000),
        }, jwtInfo.key); // DO NOT KEEP YOUR SECRET IN THE CODE!
    };
}

module.exports = Factory;
