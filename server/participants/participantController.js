var db = require('../db/db.js');

module.exports = {

  allParticipants: function(req, res, next) {

    db.Participant.findAll({include: [db.Tournament, db.User]})
    .then(function(participants){
      res.send(200, participants);
    });
  },

  newParticipant: function(req, res, next) {

    // Need to convert into their foreign keys
    var tournamentId = req.body.tournamentId;
    var userId = req.body.email;
   
    db.User.findOne({ where: { email: userId }})
    .then(function(user){
      userId = user.id; 
    })
      .then(function (){
        console.log("NEXT STEP");
        db.Participant.findOrCreate( { where : {
          UserId: userId,
          TournamentId: tournamentId
        }})
      .then(function (createdParticipant){
        if (createdParticipant){
          res.json(createdParticipant);
        }
      })
      .catch(function (error){
        next(error);
      });

    });
  }

};
