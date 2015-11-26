var logic = require('./logic');
var Sequelize = require('sequelize');
var orm = new Sequelize('wrackets', 'root', 'H0Y@');
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
    comparePasswords: function(candidatePassword, cb) {
      bcrypt.compare(candidatePassword, this.getDataValue('password'), function(err, isMatch) {
        if (err) {
          cb(err, null);
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
Tournament.belongsTo(User, { as: 'Winner' });
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
Match.belongsTo(Match, { as: 'Parent'});
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
});
// .then(function(){
//   return Status.findOrCreate({ where: { name: 'Upcoming' } });
// })
// .then(function(){
//   return Status.findOrCreate({ where: { name: 'In Progress' } });
// })
// .then(function(){
//   return Status.findOrCreate({ where: { name: 'Completed' } });
// })
// .then(function(){

//   // Games
//   Game.findOrCreate({ where: { name: 'Ping Pong' } });
//   Game.findOrCreate({ where: { name: 'Beer Pong' } });
//   Game.findOrCreate({ where: { name: '3x3 Basketball' } });

//   // Statuses

//   // Types
//   Type.findOrCreate({ where: { name: 'Single Elimination' } });

// });

  // Test Users
  // User.findOrCreate({ where: { first: 'Darth', last: 'Vader', email: 'anakin@skywalker.com', salt: '123', password: '456' } });
  // User.findOrCreate({ where: { first: 'Luke', last: 'Skywalker', email: 'luke@skywalker.com', salt: '123', password: '456' } });
  // User.findOrCreate({ where: { first: 'Han', last: 'Solo', email: 'han@falcon.org', salt: '123', password: '456'} });
  // User.findOrCreate({ where: { first: 'Leia', last: 'Organa-Solo', email: 'leia@alderaan.net', salt: '123', password: '456'} });

// .then(function(){
//   // Test Tournament
//   Tournament.findOrCreate({ where: { 
//     name: 'Death Star Pong',
//     shortname: 'deathstarpong',
//     OwnerId: 4,
//     GameId: 2,
//     TypeId: 1,
//     StatusId: 1
//   } });
// });

exports.User = User;
exports.Game = Game;
exports.Type = Type;
exports.Status = Status;
exports.Tournament = Tournament;
exports.Participant = Participant;
exports.Match = Match;
