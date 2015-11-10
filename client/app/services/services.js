angular.module('bracketmt.services', [])

.factory('Admin', function ($http) {

  var tournamentShortname = "";

  var createTournament = function(tournament) {
    
    return $http({
      method: 'POST',
      url: '/api/tournaments/',
      data: tournament
    })
    .then(function (resp){
      return resp.data;
    });
  };

  var joinTournament = function(participant) {
    
    return $http({
      method: 'POST',
      url: '/api/participants/',
      data: participant
    })
    .then(function (resp){
      return resp.data;
    });
  };

  var getTournament = function(shortname) {

    return $http({
      method: 'GET',
      url: 'api/tournaments/' + shortname
    })
    .then(function (resp){
      return resp.data;
    });

  };

  var getParticipants = function() {

    return $http({
      method: 'GET',
      url: 'api/participants/'
    })
    .then(function (resp){
      return resp.data;
    });

  };


  var getTournaments = function() {

    return $http({
      method: 'GET',
      url: 'api/tournaments/'
    })
    .then(function (resp){
      return resp.data;
    });

  };

  var getGames = function() {

    return $http({
      method: 'GET',
      url: 'api/games/games'
    })
    .then(function (resp){
      return resp.data;
    });

  };

  var getTypes = function() {
    return $http({
      method: 'GET',
      url: 'api/types/types'
    })
    .then(function (resp){
      return resp.data;
    });
  };

  return {
    tournamentShortname: tournamentShortname,
    createTournament: createTournament,
    joinTournament: joinTournament,
    getTournament: getTournament,
    getTournaments: getTournaments,
    getParticipants: getParticipants,
    getGames: getGames,
    getTypes: getTypes
  };

})

.factory('Auth', function($http, $location, $window) {

  var email = "";

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      console.log("resp is :", resp);
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: 'api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function() {
    // console.log($window.localStorage.getItem('com.bracketmt'));
    return !!$window.localStorage.getItem('com.bracketmt');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.bracketmt');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout,
    email: email
  };

});
