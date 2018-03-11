var jwtService = function (jwtInfo) {
    this.validateJwt = function (req, res) {
        var jwtToken = req.header("X-AuthToken");
        var decodedToken = jwtInfo.module.verify(jwtToken, jwtInfo.key, function (err, result) {
            if (err) {
                res.status(403).json(err);
            }
            if (result) {
                console.log(result);
                var exp = result.exp;
                var currentTime = new Date().getTime();
                if (currentTime > exp + "000") {
                    res.status(403).json("session expired.");
                }
            }
        });
    }
}
module.exports = jwtService;