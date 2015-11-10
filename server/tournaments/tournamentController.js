var db = require('../db/db.js');

module.exports = {

  allTournaments: function(req, res, next) {

    db.Tournament.findAll()
    .then(function(tournaments){
      res.send(200, tournaments);
    });
  },

  newTournament: function(req, res, next) {

    console.log(req.body);

    var name = req.body.name;
    var shortname = req.body.shortname;

    // Need to convert into their foreign keys
    // var game = req.body.game;
    // var type = req.body.type;
    // var owner = req.body.owner;
    // var status = req.body.status;

    db.Tournament.findOrCreate( { where : {
      name: name,
      shortname: shortname,
      OwnerId: 1,
      GameId: 1,
      TypeId: 1,
      StatusId: 1
    }})
    .then(function (createdTournament){
      if (createdTournament){
        res.json(createdTournament);
      }
    })
    .catch(function (error){
      next(error);
    });

  }

};
