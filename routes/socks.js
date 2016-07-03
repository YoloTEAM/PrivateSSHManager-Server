var express = require('express'),
  router = express.Router(),
  path = require('path'),
  Q = require('q'),
  async = require('async');
modelsSocks = require('../app/models/socks');

var lock = false;

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

function getTotalSocksUnUsed(country) {
  var deferred = Q.defer();
  var Socks = getModelSocksByCountry(country);
  Socks.countNotUsed(function (err, count) {
    if (err) deferred.reject(err);
    deferred.resolve(count);
  });
  return deferred.promise;
}

function resetSocks(country) {
  var deferred = Q.defer();
  var Socks = getModelSocksByCountry(country);
  Socks.update({}, {$set: {used: false}}, {multi: true}, function(err) {
    if (err) deferred.reject(err);
    deferred.resolve(true);
  });
  return deferred.promise;
}

function getRandomSocks(country, number) {
  var deferred = Q.defer();
  var Socks = getModelSocksByCountry(country);

  Socks.countNotUsed(function (err, count) {
    if (err) throw err;
    if (count <= number) {
      Socks.getAllSocksNonUsed(function (err, listSocks) {
        if (err) throw err;
        var query = {'used': {'$ne': true}};
        Socks.update(query, {$set: {used: true}}, {multi: true}, function (err) {
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
        var cf = function (listSock, callback) {
          Socks.countNotUsed(function (err, count) {
            var r = Math.floor(Math.random() * count);
            Socks.getRandomSocks(r, function (err, socks) {
              if (err) throw err;
              var s = socks[0];
              listSock.push(s);
              s.used = true;
              s.save(function (err) {
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

      async.waterfall(promises, function (err, result) {
        if (err) throw err;
        deferred.resolve(result);
      });
    }
  });
  return deferred.promise;
}

var get100Sock = function (country, number, res) {
  lock = true;
  getRandomSocks(country, number).then(function (listSocks) {
    lock = false;
    console.log('listSocks : ', listSocks.length);
    res.send(listSocks);
  });

};

var returnFail = function (res) {
  res.send(['Không lấy được socks! Vui lòng thử lại.']);
};

var timeOut = function (count, country, number, res) {
  if (count > 10) return returnFail(res);
  if (!lock) {
    get100Sock(country, number, res);
  } else {
    setTimeout(function () {
      timeOut(count + 1, country, number, res);
    }, 200);
  }
};


router.get('/', function (req, res) {
  var country, Socks;
  country = req.query.country;

  if (country == null || country == '') {
    res.sendFile(path.join(__dirname, '../views', 'socks.html'));
  }
  if (country) {
    Socks = getModelSocksByCountry(country);
    Socks.getAllSocks(function (err, listSocks) {
      if (err) throw err;
      console.log('length: ', listSocks.length);
      res.send(listSocks);
    });
  }
});

router.get('/randomSocks', function (req, res) {
  var country, number;
  country = req.query.country;
  number = parseInt(req.query.number || '10');

  if (country == null || country == '') {
    res.sendFile(path.join(__dirname, '../views', 'randomSocks.html'));
  }

  if (country) {
    timeOut(0, country, number, res);
  }
});


router.get('/totalSocksUnUsed', function (req, res) {
  var country;
  country = req.query.country;

  if (country == null || country == '') {
    res.sendFile(path.join(__dirname, '../views', 'totalSocksUnUsed.html'));
  }

  if (country) {
    getTotalSocksUnUsed(country.toUpperCase())
      .then(function (count) {
        var result = {
          'code': 200,
          'message': 'success',
          'data': {
            country: count
          },
          'errors': [
            {
              'code': 1001,
              'field': 'country',
              'message': 'Country cannot be blank'
            }

          ]
        };

        res.send(result);
      }, function (error) {

      });
  }
});

router.get('/resetSocks', function (req, res) {
  var country;
  country = req.query.country;

  if (country == null || country == '') {
    res.sendFile(path.join(__dirname, '../views', 'resetSocks.html'));
  }

  if (country) {
    resetSocks(country.toUpperCase())
      .then(function (success) {
        var result = {
          'code': 200,
          'message': 'success',
          'data': {},
          'errors': []
        };

        res.send(result);
      }, function (error) {

      });
  }
});

module.exports = router;