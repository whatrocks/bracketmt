angular.module('bracketmt.auth', [])

.controller('AuthController', function ($scope, $window, $state, $location, Auth) {

  $scope.user = {};

  $scope.signin = function () {

    Auth.email = $scope.user.email;
    Auth.userId = $scope.user.id;

    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.bracketmt', token);
        $state.go('nav.find');
        // $location.path('/nav/join');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    
    Auth.email = $scope.user.email;
    Auth.userId = $scope.user.id;

    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.bracketmt', token);
        $state.go('nav.find');
        // $location.path('/create');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // $scope.logout = function () {
  //   Auth.signout();
  // };

  // console.log("path is: ", $location.path());
  // if ($location.path() === '/logout') {
  //   console.log("LOGGING OUT");
  //   $scope.logout();
  // }

});
