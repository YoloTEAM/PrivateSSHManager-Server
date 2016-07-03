var mongoose = require('mongoose');

var SocksSchema = mongoose.Schema({
  ip: String,
  user: String,
  pass: String,
  country: String,
  live: String,
  fresh: String,
  bl: String,
  used: Boolean
});

/**
 * Static method
 */

SocksSchema.statics = {
  findByIp: function (ip, cb) {
    return this.find({ip: ip}).exec(cb);
  },
  getAllSocks: function (cb) {
    return this.find({}).exec(cb);
  },
  countNotUsed: function (cb) {
    var query = {'used': {'$ne': true}};
    return this.count(query).exec(cb);
  },
  getAllSocksNonUsed: function (cb) {
    var query = {'used': {'$ne': true}};
    return this.find(query).exec(cb);
  },
  getRandomSocks: function (r, cb) {
    var query = {'used': {'$ne': true}};
    return this.find(query).limit(1).skip(r).exec(cb);
  }
};

module.exports = {
  IDSocks: mongoose.model('IDSocks', SocksSchema, 'IDSocks'),
  RUSocks: mongoose.model('RUSocks', SocksSchema, 'RUSocks'),
  ESSocks: mongoose.model('ESSocks', SocksSchema, 'ESSocks'),
  GBSocks: mongoose.model('GBSocks', SocksSchema, 'GBSocks'),
  USSocks: mongoose.model('USSocks', SocksSchema, 'USSocks'),
  VNSocks: mongoose.model('VNSocks', SocksSchema, 'VNSocks')
};
