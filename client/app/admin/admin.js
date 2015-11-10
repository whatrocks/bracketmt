angular.module('bracketmt.admin', [])

.controller('AdminController', function($scope, $location, Admin, Auth){

  $scope.games = [];
  $scope.types = [];
  $scope.tournaments = [];
  $scope.selectedTournament = {};

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

  $scope.getTournaments = function() {
    Admin.getTournaments()
      .then(function (tournaments){
        $scope.tournaments = tournaments;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.createTournament = function() {
    
    $scope.tournament.email = Auth.email;
    $scope.tournament.status = "Upcoming";

    Admin.createTournament($scope.tournament)
      .then(function() {
        $location.path('/join');
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.join = function(tournament) {
    console.log($scope.selectedTournament);
    console.log("clicked tournament: ", tournament);

  };

  $scope.getGames();
  $scope.getTypes();
  $scope.getTournaments();

});
