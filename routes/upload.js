var express = require('express'),
  router = express.Router(),
  path = require('path'),
  formidable = require('formidable'),
  fs = require('fs'),
  modelsSocks = require('../app/models/socks');

var util = require('util')
  , es = require('event-stream');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views', 'upload.html'));
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), '../uploads');
  form.encoding = 'utf-8';
  var counter = 0;
  var items, Socks;

  form.parse(req, function (err, fields, files) {

    switch (fields.country) {
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
    var readStream = fs.createReadStream(files.fileToUpload.path)
      .pipe(es.split())
      .pipe(es.mapSync(function (line) {
        items = line.split("|");
        counter++;
        console.log('line : ', counter);

        //pause the readstream
        readStream.pause();
        Socks.findByIp(items[0], function (err, listSocks) {
          if (err) {
            readStream.resume();
            throw err;
          }

          if (listSocks.length == 0) {
            var newSock = Socks({
              ip: items[0],
              user: items[1],
              pass: items[2],
              country: items[3] || '',
              live: items[4] || '',
              fresh: items[5] || '',
              bl: items[6] || '',
              used: false
            });

            newSock.save(function (err) {
              readStream.resume();
            });
          } else {
            console.log('Socks exists!');
            readStream.resume();
          }
        });
      }))
      .on('error', function () {
        console.log('Error while reading file.');
      })
      .on('end', function () {
        console.log('Read entire file.');
        res.send('Upload socks success!');
      });
  });
})

router.get('/socks', function (req, res) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../uploads');
  form.encoding = 'utf-8';
  var counter = 0;
  var items, Socks;

  form.parse(req, function (err, fields, files) {

    switch (fields.country) {
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
    var readStream = fs.createReadStream(files.fileToUpload.path)
      .pipe(es.split())
      .pipe(es.mapSync(function (line) {
        items = line.split("|");
        counter++;
        console.log('line : ', counter);

        //pause the readstream
        readStream.pause();
        Socks.findByIp(items[0], function (err, listSocks) {
          if (err) {
            readStream.resume();
            throw err;
          }

          if (listSocks.length == 0) {
            var newSock = Socks({
              ip: items[0],
              user: items[1],
              pass: items[2],
              country: items[3] || '',
              live: items[4] || '',
              fresh: items[5] || '',
              bl: items[6] || '',
              used: false
            });

            newSock.save(function (err) {
              readStream.resume();
            });
          } else {
            console.log('Socks exists!');
            readStream.resume();
          }
        });
      }))
      .on('error', function () {
        console.log('Error while reading file.');
      })
      .on('end', function () {
        console.log('Read entire file.');
        res.send('Upload socks success!');
      });
  });
});

module.exports = router;
