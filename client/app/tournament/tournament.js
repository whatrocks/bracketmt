angular.module('bracketmt.tournament', [])

.controller('TournamentController', function ($scope, $state, $location, Auth, Admin) {

  $scope.tournament = {};
  $scope.participants = [];

  // for joining
  $scope.newParticipant = {};

  $scope.getTournament = function() {
    Admin.getTournament(Admin.tournamentShortname)
      .then(function (tournament){
        $scope.tournament = tournament;
        $scope.getParticipants();
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

    console.log("JOINING tournament"); 
    $scope.newParticipant.tournamentId = $scope.tournament.id;
    $scope.newParticipant.email = Auth.email;

    Admin.joinTournament($scope.newParticipant)
      .then(function (data) {
        console.log("I've joined a tournament");
        $scope.getParticipants();
        $state.go('nav.tournament');
      })
      .catch(function (error){
        console.log("Did not join the tournament");
        console.error(error);
      });
  };

  // TODO: figure out how to start tournament
  $scope.start = function () {};

  $scope.getTournament();
  // $scope.getParticipants();

});
