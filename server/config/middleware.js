var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function(app, express) {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
};
