var User = require('../app/models/user'), // get the mongoose model
    express = require('express'),
    router = express.Router();

// create a new user account (GET http://localhost:8080/api/signup?username=&password=)
router.post('/', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({
            success: false,
            msg: 'Please pass name and password.'
        });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Username already exists.'
                });
            }

            res.json({
                success: true,
                msg: 'Successful created new user.'
            });
        });
    }
});

module.exports = router;
