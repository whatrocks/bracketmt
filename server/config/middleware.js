var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function(app, express) {
  var userRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/users', userRouter);
  require('../users/userRoutes.js')(userRouter);
};
