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
                type: Schema.Types.ObjectId, ref: "User"
            },
            spotId: {
                type: Number
            }
        });
        //removed auto index increment as this seems to break join. ObjectId accepts a 24-length-long hex string
        // ReservationSchema.plugin(autoIncrement.plugin, 'Reservation');
        ReservationSchema.index({
            // date: 1,
            // spotId: 1,
            // userId: 1
            _id: 1
        }, {
            unique: true
        });
        ReservationSchema.index({
            date: 1,
            classId: 1,
            spotId: 1,
            userId: 1
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
                res.status(200).send(output);
            }
        });
    };


    this.insertReservation = function (req, res) {
        var reservation = new this.Reservation({
            date: jwtInfo.getDayFromDate,
            classId: req.classId,
            userId: req.userId,
            spotId: req.spotId
        });
       reservation.save(function(err, result){
           if (err) {
               res.status(400).send(err.message);
           }
           if (result) {
               res.status(200).send("Successfully reserved the spot!");
           }
       });
    };

    this.getAllReservationsByDay = function (date) {
        var query = {
            "date": date
        };
        return this.Reservation.find(query).populate('userId').exec();
    }

    this.deleteReservation = function (query, res) {

        var match = {
          date: query.date,
          userId: query.userId
        };
        this.Reservation.findOneAndRemove(match, function (error, output) {
            if (error) {
                res.status(500).json("deletion failed");
            }
            if (output) {
                res.status(200).send("Successfully deleted the user from that spot!");
            }
        });
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
