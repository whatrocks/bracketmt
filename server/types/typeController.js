var db = require('../db/db.js');

module.exports = {

  types: function(req, res, next) {

    db.Type.findAll()
    .then(function(types){
      res.send(200, types);
    });
  }

};
