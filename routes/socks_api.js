var path = require('path'),
    Q = require('q'),
    async = require('async'),
    lock = false; // request blocking

var passport = require('passport'),
    config = require('../config/database'), // get db config file
    jwt = require('jwt-simple'),
    User = require('../app/models/user'), // get the mongoose model
    express = require('express'),
    router = express.Router();

require('../config/passport')(passport); // pass passport for configuration
var modelsSocks = require('../app/models/socks');

// route to a restricted info (GET http://localhost:8080/api/getsocks?country=&number=)
router.post('/', passport.authenticate('jwt', {
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
                msg: 'User not found.'
            });
        } else {
            var country, number;
            country = req.body.country.toUpperCase();
            number = parseInt(req.body.number || 10);

            if (country == null || country == '') {
                res.json({
                    sucess: false,
                    msg: 'No country'
                });
            }

            if (country) {
                timeOut(0, country, number, res);
            }
        }
    });
});

function getModelSocksByCountry(country) {
    var Socks;
    switch (country) {
        case 'ID':
            Socks = modelsSocks.IDSocks;
            break;
        case 'RU':
            Socks = modelsSocks.RUSocks;
            break;
        case 'ES':
            Socks = modelsSocks.ESSocks;
            break;
        case 'GB':
            Socks = modelsSocks.GBSocks;
            break;
        case 'US':
            Socks = modelsSocks.USSocks;
            break;
        case 'VN':
            Socks = modelsSocks.VNSocks;
            break;
    }
    return Socks;
}

function getRandomSocks(country, number) {
    var deferred = Q.defer();
    var Socks = getModelSocksByCountry(country);
    //number = parseInt(number);
    Socks.countNotUsed(function(err, count) {
        if (err) throw err;
        if (count <= number) {
            Socks.getAllSocksNonUsed(function(err, listSocks) {
                if (err) throw err;
                var query = {
                    'used': {
                        '$ne': true
                    }
                };
                Socks.update(query, {
                    $set: {
                        used: true
                    }
                }, {
                    multi: true
                }, function(err) {
                    if (err) throw err;
                    for (var i = 0; i < listSocks.length; i++) {
                        listSocks[i].used = true;
                    }
                    deferred.resolve(listSocks);
                });
            });
        }

        if (count > number) {
            var promises = [];
            var listSock = [];
            for (var i = 0; i < number; i++) {
                var cf = function(listSock, callback) {
                    Socks.countNotUsed(function(err, count) {
                        var r = Math.floor(Math.random() * count);
                        Socks.getRandomSocks(r, function(err, socks) {
                            if (err) throw err;
                            var s = socks[0];
                            listSock.push(s);
                            s.used = true;
                            s.save(function(err) {
                                if (err) throw err;
                                callback(null, listSock);
                            });
                        });
                    });
                };

                if (i == 0) {
                    promises.push(async.apply(cf, listSock));
                } else {
                    promises.push(cf);
                }
            }

            async.waterfall(promises, function(err, result) {
                if (err) throw err;
                deferred.resolve(result);
            });
        }
    });
    return deferred.promise;
}

var returnFail = function(res) {
    res.json({
        sucess: false,
        msg: "Can't get Socks! Pls try again."
    });
};

var timeOut = function(count, country, number, res) {
    console.log('init timeOut');
    if (count > 10) return returnFail(res);
    if (!lock) {
        try {
            lock = true;
            getRandomSocks(country, number).then(function(listSocks) {
                console.log('listSocks : ', listSocks.length);
                if (listSocks.length == 0) {
                    return res.json({
                        success: false,
                        msg: "All Socks is Used."
                    });
                }

                res.send(listSocks);
            });
        } catch (e) {
            returnFail(res);
        } finally {
            lock = false;
        }
    } else {
        setTimeout(function() {
            timeOut(count + 1, country, number, res);
        }, 200);
    }
};

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
