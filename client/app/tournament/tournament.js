angular.module('bracketmt.tournament', [])

.controller('TournamentController', function ($scope, $state, $location, Auth, Admin) {

  $scope.tournament = {};
  $scope.participants = [];

  $scope.getTournament = function() {
    Admin.getTournament(Admin.tournamentShortname)
      .then(function (tournament){
        $scope.tournament = tournament;
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getParticipants = function() {
    Admin.getParticipants(Admin.tournamentShortname)
      .then(function (participants){
        for ( var i = 0; i < participants.length; i++ ) {
          if (participants[i].TournamentId === $scope.tournament.id) {
            $scope.participants.push(participants[i]);
          }
        }
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.joinTournament = function() {

  };

  // TODO: figure out how to start tournament
  $scope.start = function () {};

  $scope.getTournament();
  $scope.getParticipants();

});
