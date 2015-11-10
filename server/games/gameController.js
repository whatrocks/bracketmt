var db = require('../db/db.js');

module.exports = {

  games: function(req, res, next) {

    db.Game.findAll()
    .then(function(games){
      res.send(200, games);
    });
  }

};
