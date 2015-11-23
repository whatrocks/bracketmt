var db = require('../db/db.js');
var bluebird = require('bluebird');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

module.exports = {

  signin: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    db.User.findOne({where: { email: email}})
    .then(function (user) {
      if (!user) {
        next( new Error("User does not exist!"));
      } else {
        
        user.comparePasswords(password, function(err, foundUser){
          if (foundUser) {
            var token = jwt.encode(user, 'secret');
            res.json({token: token, email: email});            
          } else {
            return next(new Error("No user"));
        } 
        });
      }
    })
    .catch(function (error) {
      console.log("error is :", error);
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
                                  password: password } })
    .then(function (user) {
      
      console.log(user);

      return user;
    })
    .then(function (user) {
      var token = jwt.encode(user, 'secret');
      res.json({token: token, email: email});
    })
    .catch(function (error) {
      next(error);
    });

  },

  // TODO:  NOT SURE IF THIS WORKING
  checkAuth: function(req, res, next) {

    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({ email: user.email})
      .then(function (foundUser){
        if (foundUser){
          res.send(200);
        } else {
        res.send(404);
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  }

};
