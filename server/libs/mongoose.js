'use strict';
/*eslint no-console: ["warn", { allow: ["warn", "error"] }] */
const mongoose = require('mongoose');
const Config = require('./../../config');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(Config.db.mongo.url, {useMongoClient: true});
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + Config.db.mongo.url);
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});