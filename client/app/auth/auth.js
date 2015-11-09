angular.module('bracketmt.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.bracketmt', token);
        $location.path('/manage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.bracketmt', token);
        $location.path('/manage');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.logout = function () {
    Auth.signout();
  };

  console.log($location.path());
  if ($location.path() === '/logout') {
    $scope.logout();
  }


});
