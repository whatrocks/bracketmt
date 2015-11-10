var db = require('../db/db.js');

module.exports = {

  tournaments: function(req, res, next) {

    db.Tournament.findAll()
    .then(function(tournaments){
      res.send(200, tournaments);
    });
  }

};
