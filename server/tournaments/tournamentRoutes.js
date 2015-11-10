var tournamentController = require('./tournamentController.js');

module.exports = function(app) {

  app.param('code', tournamentController.getShortname);

  app.route('/')
    .get(tournamentController.allTournaments)
    .post(tournamentController.newTournament);

  app.get('/:code', tournamentController.navToTournament);

};
