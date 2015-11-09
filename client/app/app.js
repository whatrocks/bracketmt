angular.module('bracketmt', [
  'bracketmt.services',
  'bracketmt.auth',
  'ui.router',
  'ngMaterial'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('nav', {
      url: '/nav',
      templateUrl: 'app/nav/nav.html'
    })
    .state('nav.signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('nav.signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('nav.create', {
      url: '/create',
      templateUrl: 'app/admin/create.html'
    });

  $urlRouterProvider.otherwise('/nav/signup');
  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window){
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.bracketmt');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
});
