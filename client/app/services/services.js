angular.module('bracketmt.services', [])

.factory('Admin', function ($http) {

  var createTournament = function() {

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
    createTournament: createTournament,
    getGames: getGames,
    getTypes: getTypes
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
      return resp.data.token;
    });
  };

  var signup = function (user) {
    console.log("user is: ", user);
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
    console.log($window.localStorage.getItem('com.bracketmt'));
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
    signout: signout
  };

});
