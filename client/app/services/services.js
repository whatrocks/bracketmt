angular.module('bracketmt.services', [])

.factory('Admin', function ($http) {

  var tournamentId = 0;

  var createTournament = function(tournament) {
    
    return $http({
      method: 'POST',
      url: '/api/tournaments/',
      data: tournament
    })
    .then(function (resp){
      // console.log("the resp data is: ", resp.data);
      return resp.data;
    });
  };

  // TODO: Add a join specific tournament ID

  // WORK IN PROGRESS
  var getTournament = function(id) {

    return $http({
      method: 'GET',
      url: 'api/tournaments/:id'
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
    tournamentId: tournamentId,
    createTournament: createTournament,
    getTournaments: getTournaments,
    getGames: getGames,
    getTypes: getTypes
  };

})

.factory('Auth', function($http, $location, $window) {

  var email = "";
  var userId = 0;

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
    email: email,
    userId: userId
  };

});
