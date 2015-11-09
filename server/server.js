var express = require('express');
var db = require('./db/db.js');
// var Sequelize = require('sequelize');
// var orm = new Sequelize('bracketmt', 'root', 'H0Y@');
// var Promise = require('bluebird');

var app = express();

require('./config/middleware.js')(app, express);

app.listen(7777);

module.exports = app;
