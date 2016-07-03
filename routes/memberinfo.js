var passport = require('passport'),
    config = require('../config/database'), // get db config file
    jwt = require('jwt-simple'),
    User = require('../app/models/user'), // get the mongoose model
    express = require('express'),
    router = express.Router();

// pass passport for configuration
require('../config/passport')(passport);

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
router.get('/', passport.authenticate('jwt', {
    session: false
}), function(req, res, next) {
    var decoded = jwt.decode(getToken(req.headers), config.secret);
    User.findOne({
        name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(403).send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {
            res.json({
                success: true,
                msg: 'Welcome in the member area ' + user.username + '!'
            });
        }
    });
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
