var bodyParser = require('body-parser');
var helpers = require('./helpers.js');

module.exports = function(app, express) {
  var userRouter = express.Router();
  var gameRouter = express.Router();
  var typeRouter = express.Router();
  var tournamentRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/users', userRouter);
  require('../users/userRoutes.js')(userRouter);

  app.use('/api/games', gameRouter);
  require('../games/gameRoutes.js')(gameRouter);

  app.use('/api/types', typeRouter);
  require('../types/typeRoutes.js')(typeRouter);

  app.use('/api/tournaments', tournamentRouter);
  require('../tournaments/tournamentRoutes.js')(tournamentRouter);
};
