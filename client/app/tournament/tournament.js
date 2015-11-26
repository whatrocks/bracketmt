angular.module('bracketmt.tournament', [])

.controller('TournamentController', function ($scope, $state, $location, $window, Auth, Admin) {

  $scope.tournament = {};
  $scope.participants = [];
  $scope.matches = [];
  $scope.newParticipant = {};
  $scope.rounds = [];

  // Metrics in the nav bar
  $scope.numberPlayers = 0;
  $scope.numberRounds = 0;

  ////////////////////////////////////////////////
  // Nav bar metrics
  ////////////////////////////////////////////////
  $scope.matchesInRound = function(numPlayers) {
    var matches = Math.round(numPlayers / 2);
    return matches;
  };

  $scope.numberOfRounds = function(numPlayers){
    var rounds = 0;
    var roundCounter = function(players) {
      var matches = $scope.matchesInRound(players);
    
      if (matches === 1) {
        rounds++;
        return;
      } else {
        rounds++;
        roundCounter(matches);
      }
    };
    if ( numPlayers ) {
      roundCounter(numPlayers);
    }
    return rounds;
  };

  ////////////////////////////////////////////////
  // Retrieve tournament details from DB
  ////////////////////////////////////////////////

  $scope.getTournament = function() {
    Admin.getTournament(Admin.tournamentShortname)
      .then(function (tournament){
        $scope.tournament = tournament;
      })
      .then(function() {
        $scope.getParticipants();
      })
      .then(function () {
        $scope.getMatches();
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getParticipants = function() {
    Admin.getParticipants(Admin.tournamentShortname)
      .then(function (participants){
        var counter = 1;
        for ( var i = 0; i < participants.length; i++ ) {
          if (participants[i].TournamentId === $scope.tournament.id) {
            counter++;
            $scope.participants.push(participants[i]);
          }
        }
        $scope.numberPlayers = counter - 1;
        $scope.numberRounds = $scope.numberOfRounds($scope.numberPlayers);
        for ( var j = 0; j < $scope.numberRounds +1 ; j++) {
          $scope.rounds.push((j + 1));
        }
      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getMatches = function() {

    Admin.getMatches(Admin.tournamentShortname)
    .then(function (matches) {
      $scope.matches = [];
      for ( var i = 0; i < matches.length; i++ ) {
        if ( matches[i].TournamentId === $scope.tournament.id ) {
          $scope.matches.push(matches[i]);
        }
      }
      // return $scope.matches;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  ////////////////////////////////////////////////
  // User actions
  ////////////////////////////////////////////////

  $scope.joinTournament = function() {

    console.log("JOINING tournament"); 
    $scope.participants = [];
    $scope.newParticipant.tournamentId = $scope.tournament.id;
    console.log("tournie id: ", $scope.tournament.id);

    $scope.newParticipant.email = $window.localStorage.getItem('email');
    console.log("email is: ", $window.localStorage.getItem('email'));

    Admin.joinTournament($scope.newParticipant)
      .then(function (data) {
        console.log("I've joined a tournament");
        $scope.getParticipants();
      })
      .catch(function (error){
        console.log("Did not join the tournament");
        console.error(error);
      });
  };


  $scope.generateBracket = function () {
   
    Admin.generateBracket($scope.tournament)
      .then(function (data)  {
        $scope.matches.push(data);
        $scope.getTournament();
      })
      .catch(function (error) {
        console.log("Error creating a match");
        console.error(error);
      });

  };

  $scope.winRound = function(match, winner) {

    // If the match is odd, then it should go in PlayerOne
    var matchIndex = $scope.matches.indexOf(match);
    var roundCount = $scope.numberRounds;

    Admin.updateMatch(match, winner, matchIndex, roundCount)
      .then(function (data) {
        $scope.getMatches();
        // If it's the final match
        if (match.round === $scope.numberRounds) {
          $scope.tournament.Winner.first = winner.first;
          $scope.tournament.Winner.last = winner.last;          
        }
        return $scope.tournament;
      })
      .catch(function (error) {
        console.log("error adding the winner");
        console.error(error);
      });

  };


  ////////////////////////////////////////////////
  // Page load
  ////////////////////////////////////////////////


  $scope.getTournament();
  // $scope.getMatches();

});
