var db = require('../db/db.js');
var logic = require('../db/logic.js');

module.exports = {

  allMatches: function(req, res, next) {

    db.Match.findAll({include: [db.Tournament]})
    .then(function(matches){
      res.send(200, matches);
    });
  },

  generateBracket: function(req, res, next) {
    
    // RESET
    // db.Tournament.find( { where: { shortname: req.body.shortname } })
    //   .then(function (tournament) {
    //     tournament.StatusId = 1;
    //     tournament.save();
    // });

    // ACTUAL
    var status;

    db.Tournament.find( { where: { shortname: req.body.shortname } })
      .then(function (tournament) {
        status = tournament.StatusId;
        console.log("status is: ", status);
      })
      .then(function (tournament) {

        if ( status === 1 ) {

          var numPlayers = 0;
          // count the number of players in the tournament
          db.Participant.findAll( { where: {TournamentId: req.body.id} })
          .then (function(participants) {
            numPlayers = participants.length;
            console.log("number of players: ", numPlayers);

            var numRounds = logic.numberOfRounds(numPlayers);
            console.log("number of Rounds: ", numRounds);

            var recursiveChildMatches = function(round, parentId) {
              
              if ( round === 0 ) {
                return;
              }

              db.Match.create( {
                TournamentId: req.body.id,
                round: round,
                StatusId: 1,
                ParentId: parentId,
                PlayerOneId: null,
                PlayerTwoId: null,
                WinnerId: null
              })
              .then(function (createdMatch) {
                console.log("Created a match");
                console.log("createdMatch is: ", createdMatch);
                Promise.all([
                  recursiveChildMatches(round - 1, createdMatch.dataValues.id),
                  recursiveChildMatches(round - 1, createdMatch.dataValues.id)
                ]);
              })
              .catch(function (error) {
                console.error(error);
              });
            };

            recursiveChildMatches(numRounds, null);                
          })
          .then(function () {

            db.Tournament.find( { where: { shortname: req.body.shortname } })
              .then(function (tournament) {
                tournament.StatusId = 2;
                tournament.save();
            });

          })
          .then(function () {

            // pack the matches with participants

          })
          .catch(function() {
            console.error(error);
          });
        }
      });
    
  },

  addPlayerToMatch: function (req, res, next) {

  },

  winMatch: function (req, res, next) {
    // adds winnerID to match
    // adds winner to the next match
  }

};
