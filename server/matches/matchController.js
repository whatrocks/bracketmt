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
    
    var numPlayers = 0;

    // count the number of players in the tournament
    db.Participant.findAll( { where: {TournamentId: req.body.id} })
    .then (function(participants) {
      numPlayers = participants.length;
      console.log("number of players: ", numPlayers);

      var numRounds = logic.numberOfRounds(numPlayers);
      console.log("number of Rounds: ", numRounds);

      // Create match for finalRound
      db.Match.findOrCreate( { where : {
        TournamentId: req.body.id,
        round: numRounds,
        StatusId: 1
        }})
        .then(function (createdMatch){

          var parentId = createdMatch[0].dataValues.id;
          console.log("created the final match with id: ", parentId);

          // Create the other rounds recursively !!
          // Loop through each round in the tournament
          var recursiveChildMatches = function(round, parentId) {
            
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

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

          recursiveChildMatches(numRounds - 1, parentId);

          
          // ONCE THIS IS DONE, SEND BACK ALL THE MATCHES IN THAT TOURNAMENT AS THE RESPONSE JSON
          // if (createdMatch){
          //   res.json(createdMatch);
          // }

        })
        .catch(function (error){
          next(error);
        });


    })
    .catch(function() {
      console.error(error);
    });
   
  },

  addPlayerToMatch: function (req, res, next) {

  },

  winMatch: function (req, res, next) {
    // adds winnerID to match
    // adds winner to the next match
  }

};
