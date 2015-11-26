angular.module('bracketmt.admin', [])

.controller('AdminController', function ($scope, $window, $location, $state, Admin, Auth){

  $scope.games = [];
  $scope.types = [];
  $scope.tournaments = [];
  // $scope.selectedTournament = {};

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
        console.log(tournaments);
        $scope.tournaments = tournaments;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.createTournament = function() {

    Admin.tournamentShortname = $scope.tournament.shortname;

    console.log("creating tournament"); 
    $scope.tournament.email = $window.localStorage.getItem('email');
    $scope.tournament.status = "Upcoming";

    Admin.createTournament($scope.tournament)
      .then(function (data) {
        console.log("I've created a tournament");
        $state.go('nav.tournament');
      })
      .catch(function (error){
        console.log("Did not create the tournament");
        console.error(error);
      });
  };

  $scope.explore = function(tournament) {
    Admin.tournamentShortname = tournament.shortname;
    $state.go('nav.tournament');
  };

  $scope.getGames();
  $scope.getTypes();
  $scope.getTournaments();

});
