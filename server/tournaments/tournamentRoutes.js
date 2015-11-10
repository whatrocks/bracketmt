var tournamentController = require('./tournamentController.js');

module.exports = function(app) {

  app.get('/tournaments', tournamentController.tournaments);

};
