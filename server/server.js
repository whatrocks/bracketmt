var express = require('express');
var db = require('./db/db.js');

var app = express();

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

require('./config/middleware.js')(app, express);

app.listen(7777);

module.exports = app;
