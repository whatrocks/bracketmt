var gameController = require('./gameController.js');

module.exports = function(app) {

  app.get('/games', gameController.games);

};
