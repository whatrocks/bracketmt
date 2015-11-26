var db = require('../db/db.js');

module.exports = {

  getShortname: function (req, res, next, shortname) {
    db.Tournament.findOne( { where : {shortname: shortname}})
      .then(function (tournament) {
        if (tournament) {
          req.shortname = tournament.dataValues.shortname;
          next();
        } else {
          next(new Error("Couldn't find tournament"));
        }
      })
      .catch(function (error) {
        next(error);
      });
  },

  navToTournament: function (req, res, next) {
    db.Tournament.find({ where : {shortname: req.shortname}, include: [db.Game, db.Status, db.Type, { model: db.User, as: 'Owner' }, { model: db.User, as: 'Winner' }]})
      .then(function (tournament) {
        res.send(200, tournament);
    });
  },

  allTournaments: function(req, res, next) {

    db.Tournament.findAll({include: [db.Game, db.Status, db.Type, { model: db.User, as: 'Owner' }, { model: db.User, as: 'Winner' }]})
    .then(function(tournaments){
      res.send(200, tournaments);
    });
  },

  newTournament: function(req, res, next) {

    console.log(req.body);

    var name = req.body.name;
    var shortname = req.body.shortname;

    // Need to convert into their foreign keys
    var gameId = req.body.game;
    var typeId = req.body.type;
    var emailId = req.body.email;
    var statusId = req.body.status;

    Promise.all([
      db.User.findOne({ where: { email: emailId }})
        .then(function(user){
          emailId = user.id; 
        }),

      db.Type.findOne({ where: { name: typeId }})
        .then(function(type){
          typeId = type.id; 
        }),

      db.Game.findOne({ where: { name: gameId }})
        .then(function(game){
          gameId = game.id; 
        }),

      db.Status.findOne({ where: { name: statusId }})
        .then(function(status){
          statusId = status.id; 
        })

    ])
    .then(function (){
      db.Tournament.findOrCreate( { where : {
        name: name,
        shortname: shortname,
        OwnerId: emailId,
        GameId: gameId,
        TypeId: typeId,
        StatusId: statusId
      }})
      .then(function (createdTournament){
        if (createdTournament){
          res.json(createdTournament);
        }
      })
      .catch(function (error){
        next(error);
      });

    });
  }

};
