var tournamentController = require('./tournamentController.js');

module.exports = function(app) {

  app.route('/')
    .get(tournamentController.allTournaments)
    .post(tournamentController.newTournament);

};
