var db = require('../db/db.js');

module.exports = {

  allMatches: function(req, res, next) {

    db.Match.findAll({include: [db.Tournament]})
    .then(function(matches){
      res.send(200, matches);
    });
  },

  newMatch: function(req, res, next) {

    console.log("!!!!");
    console.log(req.body);

    var tournamentId = req.body.id;
    var round = 1;
   
    db.Match.findOrCreate( { where : {
      TournamentId: tournamentId,
      round: round
      }})
      .then(function (createdMatch){
        if (createdMatch){
          res.json(createdMatch);
        }
      })
      .catch(function (error){
        next(error);
      });
  },

  addPlayerToMatch: function (req, res, next) {

  },

  winMatch: function (req, res, next) {
    // adds winnerID to match
    // adds winner to the next match
  }

};
