angular.module('bracketmt.tournament', [])

.controller('TournamentController', function ($scope, $state, $location, Auth, Admin) {

  $scope.tournament = {};

  $scope.getTournament = function() {
    Admin.getTournament(Admin.tournamentShortname)
      .then(function (tournament){
        $scope.tournament = tournament;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.start = function () {};

  $scope.getTournament();

});
