angular.module('bracketmt.admin', [])

.controller('AdminController', function($scope, Admin){

  $scope.games = {};
  $scope.types = {};

  $scope.getGames = function() {
    Admin.getGames()
      .then(function (games){
        $scope.games = games;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getTypes = function() {
    Admin.getTypes()
      .then(function (types){
        $scope.types = types;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getGames();
  $scope.getTypes();

});
