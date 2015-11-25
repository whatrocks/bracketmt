var db = require('../db/db.js');
var logic = require('../db/logic.js');

module.exports = {

  allMatches: function(req, res, next) {

    db.Match.findAll({include: [
      db.Tournament, 
      { model: db.User, as: 'Winner' },
      { model: db.User, as: 'PlayerOne' },
      { model: db.User, as: 'PlayerTwo' }
    ]})
    .then(function(matches){
      res.send(200, matches);
    });
  },

  updateMatch: function(req, res, next) {

    // If the tournament is completed
      // you can't do anything anymore
    // otherwise you can update the stuff

    var updateMatch = req.body[0];
    var updateWinner = req.body[1];
    var matchIndex = req.body[2];
    var numberRounds = req.body[3];

    console.log(numberRounds);

    return db.Match.find( { where: { id: updateMatch.id } })
    .then(function (match) {
      match.WinnerId = updateWinner.id;
      match.save();

      // if final round
      if ( match.round === numberRounds ) {
        // update tournament
        // then you need to update the state of the tournament to COMPLETED
        // and set the tournament winner to the person's name

        console.log("It's the final round");

        return db.Tournament.find( { where: { id: match.TournamentId } })
        .then(function (tournament) { 
          tournament.StatusId = 3;
          tournament.save();
        })
        .then(function(){
          res.send(200);
        });



      } else {

        //Once the winner is selected, then it needs to go into the parent match
        return db.Match.find( { where: { id: match.ParentId } })
        .then(function (nextMatch) {

          console.log("matchIndex is: ", matchIndex);

          if ( matchIndex % 2 !== 0 ) {
            nextMatch.PlayerOneId = match.WinnerId;
            nextMatch.save();
          } else {
            nextMatch.PlayerTwoId = match.WinnerId;
            nextMatch.save();
          }

        })
        .then(function(){
          return db.Match.findAll({include: [
          db.Tournament, 
          { model: db.User, as: 'Winner' },
          { model: db.User, as: 'PlayerOne' },
          { model: db.User, as: 'PlayerTwo' }
          ]})
          .then(function(matches){
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            // console.log(matches);
            res.send(200, matches);
          });
        });
        
      }

    });

  },

  createMatch: function (round, parentId, tournamentId) {

    if (round === 0) {
      return;
    }

    return db.Match.create( {
      TournamentId: tournamentId,
      round: round,
      StatusId: 1,
      ParentId: parentId,
      PlayerOneId: null,
      PlayerTwoId: null,
      WinnerId: null
    });

  },

  createMatchRecursively: function (round, parentId, tournamentId) {

    var matchArray = [];

    if (round === 0) {
      return;
    }

    return Promise.all([
      db.Match.create( {
        TournamentId: tournamentId,
        round: round,
        StatusId: 1,
        ParentId: parentId,
        PlayerOneId: null,
        PlayerTwoId: null,
        WinnerId: null
      }),

      db.Match.create( {
        TournamentId: tournamentId,
        round: round,
        StatusId: 1,
        ParentId: parentId,
        PlayerOneId: null,
        PlayerTwoId: null,
        WinnerId: null
      })
    ])
    .then(function (matches) {

      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(matches);
      console.log("##############################################");

      for ( var i = 0; i < matches.length; i++ ) {
        module.exports.createMatchRecursively(round - 1, matches[i].dataValues.id, tournamentId );
      }
    
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
    var tournamentId = req.body.id;
    var tournamentStatus = req.body.StatusId;
    var numRounds = 0;
 
    if ( tournamentStatus === 1 ) {
      
      // Get all the participants in this tournament
      return db.Participant.findAll( { where: {TournamentId: tournamentId} })
        .then (function(participants) {

          var playerCount = participants.length;

          // calculate the number of rounds in tournament
          numRounds = logic.numberOfRounds(playerCount);
          console.log("There are x rounds: ", numRounds);

          // Create the final match
          return module.exports.createMatch(numRounds, null, tournamentId);
        })
        .then(function (createdMatch) {

          return module.exports.createMatchRecursively(numRounds - 1, createdMatch.id, tournamentId );

        })

          // // define a recursive function
          // var recursiveChildMatches = function(round, parentId) {  
          //   if ( round === 0 ) {
          //     return;
          //   }
          //   return db.Match.create( {
          //     TournamentId: req.body.id,
          //     round: round,
          //     StatusId: 1,
          //     ParentId: parentId,
          //     PlayerOneId: null,
          //     PlayerTwoId: null,
          //     WinnerId: null
          //   })
          //   .then(function (createdMatch) {
          //     return Promise.all([
          //       recursiveChildMatches(round - 1, createdMatch.dataValues.id),
          //       recursiveChildMatches(round - 1, createdMatch.dataValues.id)
          //     ]);
          //   });
          // }; 
          // return recursiveChildMatches(numRounds, null);
        // })
        .then(function () {
          
          return db.Tournament.find( { where: { id: req.body.id } })
            .then(function (tournament) {
              tournament.StatusId = 2;
              tournament.save();
          });
        })
        .then(function (tournament) {

          // pack the first round matches with participants          
          return db.Participant.findAll( { where: {TournamentId: tournamentId} })
          .then (function(participants) {
            var players = participants;

            return db.Match.findAll( { where: { round: 1, tournamentId: tournamentId } })
            .then(function (matches) {

                for ( var i = 0; i < matches.length; i++ ) {
                  
                  var playerOne = null;
                  var playerTwo = null;

                  if ( players.length > 0 ) {
                    playerOne = players.shift();
                    // matches[i].dataValues.PlayerOneId = playerOne.dataValues.UserId;
                  }

                  if ( players.length > 0 ) {
                    playerTwo = players.shift();
                    // matches[i].dataValues.PlayerTwoId = playerTwo.dataValues.UserId;
                  }

                  if ( playerOne && playerTwo ) {                  
                    matches[i].updateAttributes({ 
                      PlayerOneId: playerOne.dataValues.UserId,
                      PlayerTwoId: playerTwo.dataValues.UserId
                    });
                  } else if (playerOne || playerTwo ) {
                    matches[i].updateAttributes({ 
                      PlayerOneId: playerOne.dataValues.UserId
                    });
                  } else {
                    matches[i].destroy();
                    // Need to also destroy the parent
                  }
                }
                res.send(200, matches);
            })
            .catch(function (error) {
              console.error(error);
            });
        })
        .catch(function (error) {
          console.log("error packing the first round matches");
          console.error(error);
          });
        });
      } // close if statement
  },

  addPlayerToMatch: function (req, res, next) {

  },

  winMatch: function (req, res, next) {
    // adds winnerID to match
    // adds winner to the next match
  }

};
