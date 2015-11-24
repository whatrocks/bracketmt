angular.module('bracketmt.tournament', [])

.controller('TournamentController', function ($scope, $state, $location, $window, Auth, Admin) {

  $scope.tournament = {};
  $scope.participants = [];
  $scope.matches = [];
  $scope.newParticipant = {};

  // Metrics in the nav bar
  $scope.numberPlayers = 0;
  $scope.numberRounds = 0;
  
  // Bracket visualization
  // $scope.circles = [4,5,6,7,8,9,10];

  // $scope.getCircles = function() {
  //   return $scope.circles;
  // };

  // $scope.getTheData = function(circlecount) {
  //     // Generate an array of sequential numbers.
  //     $scope.theData = d3.range($scope.circlecount).map(function(i) { return (i + 1) * 5; });
  // };

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
        $scope.getParticipants();
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
            // $scope.circles.push(counter);
            counter++;
            $scope.participants.push(participants[i]);
          }
        }
        $scope.numberPlayers = counter - 1;
        $scope.numberRounds = $scope.numberOfRounds($scope.numberPlayers);
        // console.log($scope.circles);

      })
      .catch(function (error){
        console.error(error);
      });
  };

  $scope.getMatches = function() {
    Admin.getMatches(Admin.tournamentShortname)
    .then(function (matches) {
      for ( var i = 0; i < matches.length; i++ ) {
        if ( matches[i].TournamentId === $scope.tournament.id ) {
          $scope.matches.push(matches[i]);
        }
      }
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
        // $state.go('nav.tournament');
      })
      .catch(function (error){
        console.log("Did not join the tournament");
        console.error(error);
      });
  };


  $scope.generateBracket = function () {
   
    Admin.generateBracket($scope.tournament)
      .then(function (data)  {
        console.log("I've created a match");
        console.log(data);
        $scope.matches.push(data);
      })
      .catch(function (error) {
        console.log("Error creating a match");
        console.error(error);
      });

  };


  $scope.getTournament();

});
