var MatchController = require('./matchController.js');

module.exports = function (app) {

  app.route('/')
    .get(MatchController.allMatches)
    .post(MatchController.newMatch);

};
