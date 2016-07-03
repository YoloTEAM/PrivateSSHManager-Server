'use strict';
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    jwt = require('jwt-simple'),
    User = require('../app/models/user'), // load up the user model
    jwtconfig = require('../config/database'); // get db config file

module.exports = function(passport) {
    var opts = {};

    opts.secretOrKey = jwtconfig.secret;
    opts.issuer = jwtconfig.issuer;
    opts.audience = jwtconfig.audience;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(`PAYLOAD: ${jwt_payload}`);
        User.findOne({
            userName: jwt_payload.sub
        }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else done(null, false, 'User found in token not found');
        });
    }));
};
