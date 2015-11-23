angular.module('bracketmt.auth', [])

.controller('AuthController', function ($scope, $window, $state, $location, Auth) {

  $scope.user = {};

  $scope.signin = function () {

    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('email', data.email);
        // $window.localStorage.setItem('first', first);
        // $window.localStorage.setItem('last', last);
        $window.localStorage.setItem('com.bracketmt', data.token);
        $state.go('nav.find');
        // $location.path('/nav/join');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('email', data.email);
        // $window.localStorage.setItem('first', first);
        // $window.localStorage.setItem('last', last);
        $window.localStorage.setItem('com.bracketmt', data.token);
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
