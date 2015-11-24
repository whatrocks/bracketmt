angular.module('bracketmt.services', [])

.factory('Admin', function ($http) {

  var tournamentShortname = "";

  ///////////////////////////////////////
  // Tournaments
  ///////////////////////////////////////

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
  
  var getTournaments = function() {

    return $http({
      method: 'GET',
      url: 'api/tournaments/'
    })
    .then(function (resp){
      return resp.data;
    });

  };

  ///////////////////////////////////////
  // Participants
  ///////////////////////////////////////

  var getParticipants = function() {

    return $http({
      method: 'GET',
      url: 'api/participants/'
    })
    .then(function (resp){
      return resp.data;
    });

  };

  ///////////////////////////////////////
  // Matches
  ///////////////////////////////////////

  var generateBracket = function(tournament) {
    
    return $http({
      method: 'POST',
      url: '/api/matches/',
      data: tournament
    })
    .then(function (resp){
      return resp.data;
    });
  };

  var updateMatch = function(match, winner, matchIndex) {
    
    var data = [match, winner, matchIndex];

    return $http({
      method: 'PUT',
      url: '/api/matches/',
      data: data
    })
    .then(function (resp){
      return resp.data;
    });
  };

  var getMatches = function() {

    return $http({
      method: 'GET',
      url: 'api/matches/'
    })
    .then(function (resp){
      return resp.data;
    });
  };

  ///////////////////////////////////////
  // Games and types
  ///////////////////////////////////////

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
    getTypes: getTypes,
    getMatches: getMatches,
    generateBracket: generateBracket,
    updateMatch: updateMatch
  };

})

.factory('Auth', function($http, $location, $window) {

  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      console.log("resp is :", resp);
      console.log("resp.token is :", resp.token);
      return resp.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: 'api/users/signup',
      data: user
    })
    .then(function (resp) {
      console.log("resp is :", resp);
      console.log("resp.token is :", resp.token);
      return resp.data;
    });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.bracketmt');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.bracketmt');
    $window.localStorage.removeItem('email');
    // $window.localStorage.removeItem('first');
    // $window.localStorage.removeItem('last');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
