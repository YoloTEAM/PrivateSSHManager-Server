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

var aCountry = [
    ['AF', 0],
    ['AL', 0],
    ['DZ', 0],
    ['AS', 0],
    ['AD', 0],
    ['AO', 0],
    ['AI', 0],
    ['AQ', 0],
    ['AG', 0],
    ['AR', 0],
    ['AM', 0],
    ['AW', 0],
    ['AU', 0],
    ['AT', 0],
    ['AZ', 0],
    ['BS', 0],
    ['BH', 0],
    ['BD', 0],
    ['BB', 0],
    ['BY', 0],
    ['BE', 0],
    ['BZ', 0],
    ['BJ', 0],
    ['BM', 0],
    ['BT', 0],
    ['BO', 0],
    ['BA', 0],
    ['BW', 0],
    ['BR', 0],
    ['IO', 0],
    ['VG', 0],
    ['BN', 0],
    ['BG', 0],
    ['BF', 0],
    ['BI', 0],
    ['KH', 0],
    ['CM', 0],
    ['CA', 0],
    ['CV', 0],
    ['KY', 0],
    ['CF', 0],
    ['TD', 0],
    ['CL', 0],
    ['CN', 0],
    ['CX', 0],
    ['CC', 0],
    ['CO', 0],
    ['KM', 0],
    ['CK', 0],
    ['CR', 0],
    ['HR', 0],
    ['CU', 0],
    ['CW', 0],
    ['CY', 0],
    ['CZ', 0],
    ['CD', 0],
    ['DK', 0],
    ['DJ', 0],
    ['DM', 0],
    ['DO', 0],
    ['TL', 0],
    ['EC', 0],
    ['EG', 0],
    ['SV', 0],
    ['GQ', 0],
    ['ER', 0],
    ['EE', 0],
    ['ET', 0],
    ['FK', 0],
    ['FO', 0],
    ['FJ', 0],
    ['FI', 0],
    ['FR', 0],
    ['PF', 0],
    ['GA', 0],
    ['GM', 0],
    ['GE', 0],
    ['DE', 0],
    ['GH', 0],
    ['GI', 0],
    ['GR', 0],
    ['GL', 0],
    ['GD', 0],
    ['GU', 0],
    ['GT', 0],
    ['GG', 0],
    ['GN', 0],
    ['GW', 0],
    ['GY', 0],
    ['HT', 0],
    ['HN', 0],
    ['HK', 0],
    ['HU', 0],
    ['IS', 0],
    ['IN', 0],
    ['ID', 0],
    ['IR', 0],
    ['IQ', 0],
    ['IE', 0],
    ['IM', 0],
    ['IL', 0],
    ['IT', 0],
    ['CI', 0],
    ['JM', 0],
    ['JP', 0],
    ['JE', 0],
    ['JO', 0],
    ['KZ', 0],
    ['KE', 0],
    ['KI', 0],
    ['XK', 0],
    ['KW', 0],
    ['KG', 0],
    ['LA', 0],
    ['LV', 0],
    ['LB', 0],
    ['LS', 0],
    ['LR', 0],
    ['LY', 0],
    ['LI', 0],
    ['LT', 0],
    ['LU', 0],
    ['MO', 0],
    ['MK', 0],
    ['MG', 0],
    ['MW', 0],
    ['MY', 0],
    ['MV', 0],
    ['ML', 0],
    ['MT', 0],
    ['MH', 0],
    ['MR', 0],
    ['MU', 0],
    ['YT', 0],
    ['MX', 0],
    ['FM', 0],
    ['MD', 0],
    ['MC', 0],
    ['MN', 0],
    ['ME', 0],
    ['MS', 0],
    ['MA', 0],
    ['MZ', 0],
    ['MM', 0],
    ['NA', 0],
    ['NR', 0],
    ['NP', 0],
    ['NL', 0],
    ['AN', 0],
    ['NC', 0],
    ['NZ', 0],
    ['NI', 0],
    ['NE', 0],
    ['NG', 0],
    ['NU', 0],
    ['KP', 0],
    ['MP', 0],
    ['NO', 0],
    ['OM', 0],
    ['PK', 0],
    ['PW', 0],
    ['PS', 0],
    ['PA', 0],
    ['PG', 0],
    ['PY', 0],
    ['PE', 0],
    ['PH', 0],
    ['PN', 0],
    ['PL', 0],
    ['PT', 0],
    ['PR', 0],
    ['QA', 0],
    ['CG', 0],
    ['RE', 0],
    ['RO', 0],
    ['RU', 0],
    ['RW', 0],
    ['BL', 0],
    ['SH', 0],
    ['KN', 0],
    ['LC', 0],
    ['MF', 0],
    ['PM', 0],
    ['VC', 0],
    ['WS', 0],
    ['SM', 0],
    ['ST', 0],
    ['SA', 0],
    ['SN', 0],
    ['RS', 0],
    ['SC', 0],
    ['SL', 0],
    ['SG', 0],
    ['SX', 0],
    ['SK', 0],
    ['SI', 0],
    ['SB', 0],
    ['SO', 0],
    ['ZA', 0],
    ['KR', 0],
    ['SS', 0],
    ['ES', 0],
    ['LK', 0],
    ['SD', 0],
    ['SR', 0],
    ['SJ', 0],
    ['SZ', 0],
    ['SE', 0],
    ['CH', 0],
    ['SY', 0],
    ['TW', 0],
    ['TJ', 0],
    ['TZ', 0],
    ['TH', 0],
    ['TG', 0],
    ['TK', 0],
    ['TO', 0],
    ['TT', 0],
    ['TN', 0],
    ['TR', 0],
    ['TM', 0],
    ['TC', 0],
    ['TV', 0],
    ['VI', 0],
    ['UG', 0],
    ['UA', 0],
    ['AE', 0],
    ['GB', 0],
    ['US', 0],
    ['UY', 0],
    ['UZ', 0],
    ['VU', 0],
    ['VA', 0],
    ['VE', 0],
    ['VN', 0],
    ['WF', 0],
    ['EH', 0],
    ['YE', 0],
    ['ZM', 0],
    ['ZW', 0]
];

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
            if (!req.body.country) {
                res.json({
                    sucess: false,
                    msg: 'No country'
                });
            } else {
                timeOut(0, req.body.country, parseInt(req.body.number || 10), res);
            }
        }
    });
});

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
                msg: 'User not found.'
            });
        } else {
            if (!req.query.country) {
                return res.send('0');
            }

            try {
                getTotalSocksUnUsed(req.query.country)
                    .then(function(count) {
                        res.send(count.toString());
                    }, function(error) {
                        res.send('0');
                    });
            } catch (e) {
                res.send('0');
            }
        }
    });
});

function getTotalSocksUnUsed(country) {
    var deferred = Q.defer();
    var Socks = getModelSocksByCountry(country);
    Socks.countNotUsed(function(err, count) {
        if (err) deferred.reject(err);
        deferred.resolve(count);
    });
    return deferred.promise;
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

function getModelSocksByCountry(country) {
    var Socks;
    switch (country.toUpperCase()) {
        case 'AF':
            Socks = modelsSocks.AF
            break;
        case 'AL':
            Socks = modelsSocks.AL
            break;
        case 'DZ':
            Socks = modelsSocks.DZ
            break;
        case 'AS':
            Socks = modelsSocks.AS
            break;
        case 'AD':
            Socks = modelsSocks.AD
            break;
        case 'AO':
            Socks = modelsSocks.AO
            break;
        case 'AI':
            Socks = modelsSocks.AI
            break;
        case 'AQ':
            Socks = modelsSocks.AQ
            break;
        case 'AG':
            Socks = modelsSocks.AG
            break;
        case 'AR':
            Socks = modelsSocks.AR
            break;
        case 'AM':
            Socks = modelsSocks.AM
            break;
        case 'AW':
            Socks = modelsSocks.AW
            break;
        case 'AU':
            Socks = modelsSocks.AU
            break;
        case 'AT':
            Socks = modelsSocks.AT
            break;
        case 'AZ':
            Socks = modelsSocks.AZ
            break;
        case 'BS':
            Socks = modelsSocks.BS
            break;
        case 'BH':
            Socks = modelsSocks.BH
            break;
        case 'BD':
            Socks = modelsSocks.BD
            break;
        case 'BB':
            Socks = modelsSocks.BB
            break;
        case 'BY':
            Socks = modelsSocks.BY
            break;
        case 'BE':
            Socks = modelsSocks.BE
            break;
        case 'BZ':
            Socks = modelsSocks.BZ
            break;
        case 'BJ':
            Socks = modelsSocks.BJ
            break;
        case 'BM':
            Socks = modelsSocks.BM
            break;
        case 'BT':
            Socks = modelsSocks.BT
            break;
        case 'BO':
            Socks = modelsSocks.BO
            break;
        case 'BA':
            Socks = modelsSocks.BA
            break;
        case 'BW':
            Socks = modelsSocks.BW
            break;
        case 'BR':
            Socks = modelsSocks.BR
            break;
        case 'IO':
            Socks = modelsSocks.IO
            break;
        case 'VG':
            Socks = modelsSocks.VG
            break;
        case 'BN':
            Socks = modelsSocks.BN
            break;
        case 'BG':
            Socks = modelsSocks.BG
            break;
        case 'BF':
            Socks = modelsSocks.BF
            break;
        case 'BI':
            Socks = modelsSocks.BI
            break;
        case 'KH':
            Socks = modelsSocks.KH
            break;
        case 'CM':
            Socks = modelsSocks.CM
            break;
        case 'CA':
            Socks = modelsSocks.CA
            break;
        case 'CV':
            Socks = modelsSocks.CV
            break;
        case 'KY':
            Socks = modelsSocks.KY
            break;
        case 'CF':
            Socks = modelsSocks.CF
            break;
        case 'TD':
            Socks = modelsSocks.TD
            break;
        case 'CL':
            Socks = modelsSocks.CL
            break;
        case 'CN':
            Socks = modelsSocks.CN
            break;
        case 'CX':
            Socks = modelsSocks.CX
            break;
        case 'CC':
            Socks = modelsSocks.CC
            break;
        case 'CO':
            Socks = modelsSocks.CO
            break;
        case 'KM':
            Socks = modelsSocks.KM
            break;
        case 'CK':
            Socks = modelsSocks.CK
            break;
        case 'CR':
            Socks = modelsSocks.CR
            break;
        case 'HR':
            Socks = modelsSocks.HR
            break;
        case 'CU':
            Socks = modelsSocks.CU
            break;
        case 'CW':
            Socks = modelsSocks.CW
            break;
        case 'CY':
            Socks = modelsSocks.CY
            break;
        case 'CZ':
            Socks = modelsSocks.CZ
            break;
        case 'CD':
            Socks = modelsSocks.CD
            break;
        case 'DK':
            Socks = modelsSocks.DK
            break;
        case 'DJ':
            Socks = modelsSocks.DJ
            break;
        case 'DM':
            Socks = modelsSocks.DM
            break;
        case 'DO':
            Socks = modelsSocks.DO
            break;
        case 'TL':
            Socks = modelsSocks.TL
            break;
        case 'EC':
            Socks = modelsSocks.EC
            break;
        case 'EG':
            Socks = modelsSocks.EG
            break;
        case 'SV':
            Socks = modelsSocks.SV
            break;
        case 'GQ':
            Socks = modelsSocks.GQ
            break;
        case 'ER':
            Socks = modelsSocks.ER
            break;
        case 'EE':
            Socks = modelsSocks.EE
            break;
        case 'ET':
            Socks = modelsSocks.ET
            break;
        case 'FK':
            Socks = modelsSocks.FK
            break;
        case 'FO':
            Socks = modelsSocks.FO
            break;
        case 'FJ':
            Socks = modelsSocks.FJ
            break;
        case 'FI':
            Socks = modelsSocks.FI
            break;
        case 'FR':
            Socks = modelsSocks.FR
            break;
        case 'PF':
            Socks = modelsSocks.PF
            break;
        case 'GA':
            Socks = modelsSocks.GA
            break;
        case 'GM':
            Socks = modelsSocks.GM
            break;
        case 'GE':
            Socks = modelsSocks.GE
            break;
        case 'DE':
            Socks = modelsSocks.DE
            break;
        case 'GH':
            Socks = modelsSocks.GH
            break;
        case 'GI':
            Socks = modelsSocks.GI
            break;
        case 'GR':
            Socks = modelsSocks.GR
            break;
        case 'GL':
            Socks = modelsSocks.GL
            break;
        case 'GD':
            Socks = modelsSocks.GD
            break;
        case 'GU':
            Socks = modelsSocks.GU
            break;
        case 'GT':
            Socks = modelsSocks.GT
            break;
        case 'GG':
            Socks = modelsSocks.GG
            break;
        case 'GN':
            Socks = modelsSocks.GN
            break;
        case 'GW':
            Socks = modelsSocks.GW
            break;
        case 'GY':
            Socks = modelsSocks.GY
            break;
        case 'HT':
            Socks = modelsSocks.HT
            break;
        case 'HN':
            Socks = modelsSocks.HN
            break;
        case 'HK':
            Socks = modelsSocks.HK
            break;
        case 'HU':
            Socks = modelsSocks.HU
            break;
        case 'IS':
            Socks = modelsSocks.IS
            break;
        case 'IN':
            Socks = modelsSocks.IN
            break;
        case 'ID':
            Socks = modelsSocks.ID
            break;
        case 'IR':
            Socks = modelsSocks.IR
            break;
        case 'IQ':
            Socks = modelsSocks.IQ
            break;
        case 'IE':
            Socks = modelsSocks.IE
            break;
        case 'IM':
            Socks = modelsSocks.IM
            break;
        case 'IL':
            Socks = modelsSocks.IL
            break;
        case 'IT':
            Socks = modelsSocks.IT
            break;
        case 'CI':
            Socks = modelsSocks.CI
            break;
        case 'JM':
            Socks = modelsSocks.JM
            break;
        case 'JP':
            Socks = modelsSocks.JP
            break;
        case 'JE':
            Socks = modelsSocks.JE
            break;
        case 'JO':
            Socks = modelsSocks.JO
            break;
        case 'KZ':
            Socks = modelsSocks.KZ
            break;
        case 'KE':
            Socks = modelsSocks.KE
            break;
        case 'KI':
            Socks = modelsSocks.KI
            break;
        case 'XK':
            Socks = modelsSocks.XK
            break;
        case 'KW':
            Socks = modelsSocks.KW
            break;
        case 'KG':
            Socks = modelsSocks.KG
            break;
        case 'LA':
            Socks = modelsSocks.LA
            break;
        case 'LV':
            Socks = modelsSocks.LV
            break;
        case 'LB':
            Socks = modelsSocks.LB
            break;
        case 'LS':
            Socks = modelsSocks.LS
            break;
        case 'LR':
            Socks = modelsSocks.LR
            break;
        case 'LY':
            Socks = modelsSocks.LY
            break;
        case 'LI':
            Socks = modelsSocks.LI
            break;
        case 'LT':
            Socks = modelsSocks.LT
            break;
        case 'LU':
            Socks = modelsSocks.LU
            break;
        case 'MO':
            Socks = modelsSocks.MO
            break;
        case 'MK':
            Socks = modelsSocks.MK
            break;
        case 'MG':
            Socks = modelsSocks.MG
            break;
        case 'MW':
            Socks = modelsSocks.MW
            break;
        case 'MY':
            Socks = modelsSocks.MY
            break;
        case 'MV':
            Socks = modelsSocks.MV
            break;
        case 'ML':
            Socks = modelsSocks.ML
            break;
        case 'MT':
            Socks = modelsSocks.MT
            break;
        case 'MH':
            Socks = modelsSocks.MH
            break;
        case 'MR':
            Socks = modelsSocks.MR
            break;
        case 'MU':
            Socks = modelsSocks.MU
            break;
        case 'YT':
            Socks = modelsSocks.YT
            break;
        case 'MX':
            Socks = modelsSocks.MX
            break;
        case 'FM':
            Socks = modelsSocks.FM
            break;
        case 'MD':
            Socks = modelsSocks.MD
            break;
        case 'MC':
            Socks = modelsSocks.MC
            break;
        case 'MN':
            Socks = modelsSocks.MN
            break;
        case 'ME':
            Socks = modelsSocks.ME
            break;
        case 'MS':
            Socks = modelsSocks.MS
            break;
        case 'MA':
            Socks = modelsSocks.MA
            break;
        case 'MZ':
            Socks = modelsSocks.MZ
            break;
        case 'MM':
            Socks = modelsSocks.MM
            break;
        case 'NA':
            Socks = modelsSocks.NA
            break;
        case 'NR':
            Socks = modelsSocks.NR
            break;
        case 'NP':
            Socks = modelsSocks.NP
            break;
        case 'NL':
            Socks = modelsSocks.NL
            break;
        case 'AN':
            Socks = modelsSocks.AN
            break;
        case 'NC':
            Socks = modelsSocks.NC
            break;
        case 'NZ':
            Socks = modelsSocks.NZ
            break;
        case 'NI':
            Socks = modelsSocks.NI
            break;
        case 'NE':
            Socks = modelsSocks.NE
            break;
        case 'NG':
            Socks = modelsSocks.NG
            break;
        case 'NU':
            Socks = modelsSocks.NU
            break;
        case 'KP':
            Socks = modelsSocks.KP
            break;
        case 'MP':
            Socks = modelsSocks.MP
            break;
        case 'NO':
            Socks = modelsSocks.NO
            break;
        case 'OM':
            Socks = modelsSocks.OM
            break;
        case 'PK':
            Socks = modelsSocks.PK
            break;
        case 'PW':
            Socks = modelsSocks.PW
            break;
        case 'PS':
            Socks = modelsSocks.PS
            break;
        case 'PA':
            Socks = modelsSocks.PA
            break;
        case 'PG':
            Socks = modelsSocks.PG
            break;
        case 'PY':
            Socks = modelsSocks.PY
            break;
        case 'PE':
            Socks = modelsSocks.PE
            break;
        case 'PH':
            Socks = modelsSocks.PH
            break;
        case 'PN':
            Socks = modelsSocks.PN
            break;
        case 'PL':
            Socks = modelsSocks.PL
            break;
        case 'PT':
            Socks = modelsSocks.PT
            break;
        case 'PR':
            Socks = modelsSocks.PR
            break;
        case 'QA':
            Socks = modelsSocks.QA
            break;
        case 'CG':
            Socks = modelsSocks.CG
            break;
        case 'RE':
            Socks = modelsSocks.RE
            break;
        case 'RO':
            Socks = modelsSocks.RO
            break;
        case 'RU':
            Socks = modelsSocks.RU
            break;
        case 'RW':
            Socks = modelsSocks.RW
            break;
        case 'BL':
            Socks = modelsSocks.BL
            break;
        case 'SH':
            Socks = modelsSocks.SH
            break;
        case 'KN':
            Socks = modelsSocks.KN
            break;
        case 'LC':
            Socks = modelsSocks.LC
            break;
        case 'MF':
            Socks = modelsSocks.MF
            break;
        case 'PM':
            Socks = modelsSocks.PM
            break;
        case 'VC':
            Socks = modelsSocks.VC
            break;
        case 'WS':
            Socks = modelsSocks.WS
            break;
        case 'SM':
            Socks = modelsSocks.SM
            break;
        case 'ST':
            Socks = modelsSocks.ST
            break;
        case 'SA':
            Socks = modelsSocks.SA
            break;
        case 'SN':
            Socks = modelsSocks.SN
            break;
        case 'RS':
            Socks = modelsSocks.RS
            break;
        case 'SC':
            Socks = modelsSocks.SC
            break;
        case 'SL':
            Socks = modelsSocks.SL
            break;
        case 'SG':
            Socks = modelsSocks.SG
            break;
        case 'SX':
            Socks = modelsSocks.SX
            break;
        case 'SK':
            Socks = modelsSocks.SK
            break;
        case 'SI':
            Socks = modelsSocks.SI
            break;
        case 'SB':
            Socks = modelsSocks.SB
            break;
        case 'SO':
            Socks = modelsSocks.SO
            break;
        case 'ZA':
            Socks = modelsSocks.ZA
            break;
        case 'KR':
            Socks = modelsSocks.KR
            break;
        case 'SS':
            Socks = modelsSocks.SS
            break;
        case 'ES':
            Socks = modelsSocks.ES
            break;
        case 'LK':
            Socks = modelsSocks.LK
            break;
        case 'SD':
            Socks = modelsSocks.SD
            break;
        case 'SR':
            Socks = modelsSocks.SR
            break;
        case 'SJ':
            Socks = modelsSocks.SJ
            break;
        case 'SZ':
            Socks = modelsSocks.SZ
            break;
        case 'SE':
            Socks = modelsSocks.SE
            break;
        case 'CH':
            Socks = modelsSocks.CH
            break;
        case 'SY':
            Socks = modelsSocks.SY
            break;
        case 'TW':
            Socks = modelsSocks.TW
            break;
        case 'TJ':
            Socks = modelsSocks.TJ
            break;
        case 'TZ':
            Socks = modelsSocks.TZ
            break;
        case 'TH':
            Socks = modelsSocks.TH
            break;
        case 'TG':
            Socks = modelsSocks.TG
            break;
        case 'TK':
            Socks = modelsSocks.TK
            break;
        case 'TO':
            Socks = modelsSocks.TO
            break;
        case 'TT':
            Socks = modelsSocks.TT
            break;
        case 'TN':
            Socks = modelsSocks.TN
            break;
        case 'TR':
            Socks = modelsSocks.TR
            break;
        case 'TM':
            Socks = modelsSocks.TM
            break;
        case 'TC':
            Socks = modelsSocks.TC
            break;
        case 'TV':
            Socks = modelsSocks.TV
            break;
        case 'VI':
            Socks = modelsSocks.VI
            break;
        case 'UG':
            Socks = modelsSocks.UG
            break;
        case 'UA':
            Socks = modelsSocks.UA
            break;
        case 'AE':
            Socks = modelsSocks.AE
            break;
        case 'GB':
            Socks = modelsSocks.GB
            break;
        case 'US':
            Socks = modelsSocks.US
            break;
        case 'UY':
            Socks = modelsSocks.UY
            break;
        case 'UZ':
            Socks = modelsSocks.UZ
            break;
        case 'VU':
            Socks = modelsSocks.VU
            break;
        case 'VA':
            Socks = modelsSocks.VA
            break;
        case 'VE':
            Socks = modelsSocks.VE
            break;
        case 'VN':
            Socks = modelsSocks.VN
            break;
        case 'WF':
            Socks = modelsSocks.WF
            break;
        case 'EH':
            Socks = modelsSocks.EH
            break;
        case 'YE':
            Socks = modelsSocks.YE
            break;
        case 'ZM':
            Socks = modelsSocks.ZM
            break;
        case 'ZW':
            Socks = modelsSocks.ZW
            break;
    }
    return Socks;
}

module.exports = router;
