var db = require('../db/db.js');
var bluebird = require('bluebird');
var jwt = require('jwt-simple');

module.exports = {

  signin: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    db.User.findOne({where: { email: email}})
    .then(function (user) {
      var token = jwt.encode(user, 'secret');
      res.json({token: token});
    })
    .catch(function (error) {
      next(error);
    });

  }, 

  signup: function(req, res, next) {
    var first = req.body.firstname;
    var last = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;

    console.log(req.body);

    db.User.findOrCreate({ where: { first: first, 
                                  last: last, 
                                  email: email, 
                                  salt: 'salty', 
                                  hash: password } })
    .then(function (user) {
      // user = user.dataValues;
      console.log("user is now: ", user);
      var token = jwt.encode(user, 'secret');
      res.json({token: token});
    })
    .catch(function (error) {
      next(error);
    });

  },

  checkAuth: function() {

    // var token = req.headers['x-access-token'];
    // if (!token) {
    //   next(new Error('No token'));
    // } else {
    //   var user = jwt.decode(token, 'secret');
    //   db.User.findOne({ email: user.email})
    //   .then(function (foundUser){
    //     if (foundUser){
    //       res.send(200);
    //     } else {
    //     res.send(404);
    //     }
    //   })
    //   .catch(function (error) {
    //     next(error);
    //   });
    // }
  }

};
