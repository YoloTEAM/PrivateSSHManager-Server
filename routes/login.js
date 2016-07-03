var config = require('../config/database'), // get db config file
    jwt = require('jwt-simple'),
    User = require('../app/models/user'), // get the mongoose model
    express = require('express'),
    router = express.Router();

// route to authenticate a user (GET http://localhost:8080/api/login?username=&password=)
router.get('/', function(req, res) {
    if (!req.query.username || !req.query.password) {
        res.json({
            success: false,
            msg: 'Please pass name and password.'
        });
    } else {
        User.findOne({
            username: req.query.username
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({
                    success: false,
                    msg: 'User not found.'
                });
            } else {
                // check if password matches
                user.comparePassword(req.query.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        res.json({
                            success: true,
                            token: 'JWT ' + token
                        });
                    } else {
                        res.send({
                            success: false,
                            msg: 'Wrong password.'
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;
