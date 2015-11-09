var express = require('express');
// var db = require('./db/db.js');

var app = express();

require('./config/middleware.js')(app, express);

app.listen(8000);

module.exports = app;
