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
          console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          tournament.WinnerId = match.WinnerId; 
          tournament.StatusId = 3;
          tournament.save();
        })
        .then(function (tournament) {
          res.status(200).send(tournament);
        });



      } else {

        //Once the winner is selected, then it needs to go into the parent match
        return db.Match.find( { where: { id: match.ParentId } })
        .then(function (nextMatch) {

          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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

    return db.Tournament.find( { where: { id: tournamentId } })
    .then(function (tournament) {
      
      if ( tournament.StatusId === 1) {
      


        return db.Match.create( {
          TournamentId: tournamentId,
          round: round,
          StatusId: 1,
          ParentId: parentId,
          PlayerOneId: null,
          PlayerTwoId: null,
          WinnerId: null
        });

      }

    });

  },

  createMatchRecursively: function (round, parentId, tournamentId) {

    var matchArray = [];

    if (round === 0) {
      return;
    }

    // check the tournament id
    return db.Tournament.find( { where: { id: tournamentId } })
    .then(function (tournament) {
      
      // add the check for status of 1
      if ( tournament.StatusId === 1 ) {
        
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
          return Promise.all([
            module.exports.createMatchRecursively(round - 1, matches[0].dataValues.id, tournamentId )
          ])
          .then(function() {
            return Promise.all([
              module.exports.createMatchRecursively(round - 1, matches[1].dataValues.id, tournamentId )
            ]);
          });
        });
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
    
    // need to make sure that status is 2 or 3

    console.log("STATUS!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(tournamentStatus);
    console.log(req.body);
    if ( tournamentStatus === 1 ) {
      
      // Get all the participants in this tournament
      return db.Participant.findAll( { where: {TournamentId: tournamentId} })
        .then (function(participants) {

          var playerCount = participants.length;

          // calculate the number of rounds in tournament
          numRounds = logic.numberOfRounds(playerCount);

          // Create the final match
          return module.exports.createMatch(numRounds, null, tournamentId);
        })
        .then(function (createdMatch) {

          return module.exports.createMatchRecursively(numRounds - 1, createdMatch.id, tournamentId );
        
        })
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

            return db.Match.findAll( { where: { tournamentId: tournamentId } })
            .then(function (matches) {

                var abandonedParents = [];

                var firstRoundMatches = [];
                for (var k = 0; k < matches.length; k++ ) {
                  if (matches[k].round === 1) {
                    firstRoundMatches.push(matches[k]);
                  }
                }

                for ( var i = 0; i < firstRoundMatches.length; i++ ) {
                  
                  var playerOne = null;
                  var playerTwo = null;

                  if ( players.length > 0 ) {
                    playerOne = players.shift();
                    // firstRoundMatches[i].dataValues.PlayerOneId = playerOne.dataValues.UserId;
                  }

                  if ( players.length > 0 ) {
                    playerTwo = players.shift();
                    // firstRoundMatches[i].dataValues.PlayerTwoId = playerTwo.dataValues.UserId;
                  }

                  if ( playerOne && playerTwo ) {                  
                    firstRoundMatches[i].updateAttributes({ 
                      PlayerOneId: playerOne.dataValues.UserId,
                      PlayerTwoId: playerTwo.dataValues.UserId
                    });
                  } else if (playerOne || playerTwo ) {
                    firstRoundMatches[i].updateAttributes({ 
                      PlayerOneId: playerOne.dataValues.UserId
                    });
                  } else {
                    
                    // trying to destroy parent ids
                    // var count = matches.length;

                    // for (var j = 0; j < count; j++ ) {
                    //   if (matches[j].id === firstRoundMatches[i].ParentId ) {
                    //     matches[j].destroy();
                    //     break;
                    //   }
                    // }

                    var parentId = firstRoundMatches[i].ParentId;
                    abandonedParents.push(parentId);
                    // var count = matches.length;
                    // for (var j = 0; j < count; j++ ) {
                    //   if (matches[j].id === firstRoundMatches[i].ParentId ) {
                    //     matches[j].destroy();
                    //     break;
                    //   }
                    // }
                    
                    // db.Match.find( { where: { id: parentId } })
                    // .then(function(foundMatch) {
                    //     foundMatch.destroy();
                    //   });
                    // });

                    firstRoundMatches[i].destroy();
                  }

                  // // don't remove parents that actually have children
                  // for (var l = 0; l < abandonedParents.length; i++) {
                  //   if ( abandonedParents[l].id === firstRoundMatches[i].ParentId) {
                  //     abandonedParents = abandonedParents.splice(j, 1);
                  //   }
                  // }

                }

                // remove the abandoned parents
                // for (var o = 0; o < abandonedParents.length; o++) {

                //   db.Match.find( { where: {id: abandonedParents[o].id }})
                //   .then(function(match) {
                //     match.destroy();
                //   });

                // } 

                // send the results
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

};
