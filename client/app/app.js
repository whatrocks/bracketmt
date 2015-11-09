angular.module('bracketmt', [
  'ui.router',
  'ngMaterial'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('nav', {
      url: '/',
      templateUrl: 'app/nav/nav.html'
    });

  $urlRouterProvider.otherwise('/');
});
