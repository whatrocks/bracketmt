var tournamentController = require('./tournamentController.js');

module.exports = function(app) {

  // app.param('id', tournamentController.getId);

  app.route('/')
    .get(tournamentController.allTournaments)
    .post(tournamentController.newTournament);

  // app.get('/:id', tournamentController.navToId);

};
