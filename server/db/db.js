var logic = require('./logic');
var Sequelize = require('sequelize');
var orm = new Sequelize('bracketmt', 'root', 'H0Y@');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

///////////////////////////////////////////////////////
// Schema + Initialization with test data
///////////////////////////////////////////////////////

var User = orm.define('User', {
  first: { type: Sequelize.STRING, allowNull: false },
  last: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  salt: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false }
}, {
  instanceMethods: {
    comparePassword: function(candidatePassword, cb) {
      bcrypt.compare(candidatePassword, this.getDataValue('password'), function(err, isMatch) {
        if (err) {
          return cb(err);
        } else {
          cb(null, isMatch);
        }
      });
    }
  } 
});

User.addHook('beforeCreate', 'hashPassword', function(user, options, next){
  
  console.log("hashing the password");
  
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

    if (err) {
      return next(err);
    }

    console.log("salt is: ", salt);

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) {
        return next(err);
      }

      console.log("hash is: ", hash);
      user.set('password', hash);
      user.set('salt', salt);
      next();
    });
  });
});


var Game = orm.define('Game', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true }
});

var Type = orm.define('Type', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true }
});

var Status = orm.define('Status', {
  name: { type: Sequelize.STRING, allowNull: false, unique: true }
});

var Tournament = orm.define('Tournament', {
  name: { type: Sequelize.STRING, allowNull: false },
  shortname: { type: Sequelize.STRING, allowNull: false, unique: true },
});

Tournament.belongsTo(User, { as: 'Owner' });
Tournament.belongsTo(Game);
Tournament.belongsTo(Type);
Tournament.belongsTo(Status);

var Participant = orm.define('Participant', {
});

Participant.belongsTo(Tournament);
Participant.belongsTo(User);

var Match = orm.define('Match', {
  round: { type: Sequelize.INTEGER, allowNull: false }
});

Match.belongsTo(Tournament);
Match.belongsTo(User, { as: 'PlayerOne'});
Match.belongsTo(User, { as: 'PlayerTwo'});
Match.belongsTo(User, { as: 'Winner'});
Match.belongsTo(Status);

Promise.all([
  User.sync(),
  Game.sync(),
  Type.sync(),
  Status.sync()
])
.then(function(){
  Tournament.sync();
})
.then(function(){
  Participant.sync();
})
.then(function(){
  Match.sync();
})
.then(function(){

  // Games
  Game.findOrCreate({ where: { name: 'Ping Pong' } });
  Game.findOrCreate({ where: { name: 'Beer Pong' } });
  Game.findOrCreate({ where: { name: '3x3 Basketball' } });

  // Statuses
  Status.findOrCreate({ where: { name: 'Upcoming' } });
  Status.findOrCreate({ where: { name: 'In Progress' } });
  Status.findOrCreate({ where: { name: 'Completed' } });

  // Types
  Type.findOrCreate({ where: { name: 'Single Elimination' } });

  // Test Users
  User.findOrCreate({ where: { first: 'Darth', last: 'Vader', email: 'anakin@skywalker.com', salt: '123', password: '456' } });
  User.findOrCreate({ where: { first: 'Luke', last: 'Skywalker', email: 'luke@skywalker.com', salt: '123', password: '456' } });
  User.findOrCreate({ where: { first: 'Han', last: 'Solo', email: 'han@falcon.org', salt: '123', password: '456'} });
  User.findOrCreate({ where: { first: 'Leia', last: 'Organa-Solo', email: 'leia@alderaan.net', salt: '123', password: '456'} });

})
.then(function(){
  // Test Tournament
  Tournament.findOrCreate({ where: { 
    name: 'Death Star Pong',
    shortname: 'deathstarpong',
    OwnerId: 4,
    GameId: 2,
    TypeId: 1,
    StatusId: 1
  } });
// TODO: add error catch  
});

exports.User = User;
exports.Game = Game;
exports.Type = Type;
exports.Status = Status;
exports.Tournament = Tournament;
exports.Participant = Participant;
exports.Match = Match;


///////////////////////////////////////////////
// Original direct SQL strings
///////////////////////////////////////////////

// var getUsers = function(callback) {
//   var queryStr = "select * from users";
//   connection.query(queryStr, function(err, results){
//     callback(err, results);
//   });
// };

// var checkStatus = function(shortname, callback) {
//   var queryStr = "select id_status from tournaments where shortname ='" + shortname + "'";
//   connection.query(queryStr, function(err, results){
//     callback(err, JSON.stringify(results));
//   });
// };


// getUsers(function(err, results){
//   if (err) {
//     console.log("error getting users");
//   } else {
//     console.log(JSON.stringify(results));
//   }
// });


// // Add number of rounds to the 'tournaments' table

// var generateMatches = function(callback) {

//   // check if id_status is 'CLOSED'
//   checkStatus('deathstarbeerpong', function(err, results){
//     if (err) {
//       console.log("error: ", err);
//     }
//     results = JSON.parse(results);
//     console.log("results: ", results[0]);
//     if (results[0].id_status !== 2) {
//       console.log("The tournament is not ready to generate matches yet.");
//     } else {
//       // generate matches (count number of participants)
//       console.log("Time to make the brackets!");
//       console.log("Getting the players now...");

//       var queryStr = "select * from participants where id_tournaments=1";
//       connection.query(queryStr, function(err, results){
//         if (err){
//           console.log("error");
//         } else {
//           console.log(JSON.parse(JSON.stringify(results)));
//         }
//       });

//     }
//   });
// };

// generateMatches();
