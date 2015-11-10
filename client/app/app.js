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
      templateUrl: 'app/nav/nav.html',
      authenticate: true
    })
    .state('nav.signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController',
      authenticate: false
    })
    .state('nav.signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController',
      authenticate: false
    })
    .state('nav.create', {
      url: '/create',
      templateUrl: 'app/admin/create.html',
      authenticate: true
    })
    .state('nav.logout', {
      url: '/logout',
      templateUrl: 'app/auth/signin.html',
      authenticate: false
    });

  $urlRouterProvider.otherwise('/nav/create');
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
})
.run(function ($rootScope, $location, Auth){
  $rootScope.$on('$stateChangeStart', function (evt, next, current){
    
    if (next.url === "/logout"){
      Auth.signout();
    }

    // console.log(next);
    // console.log(next.authenticate);
    // console.log("auth is: ", Auth.isAuth());
    if (next && next.authenticate && !Auth.isAuth()){
      console.log("You need to sign in");
      $location.path('/nav/signin');
    }
  });
});
