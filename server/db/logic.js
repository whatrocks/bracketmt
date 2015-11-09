var matchesInRound = function(numPlayers) {
  var matches = Math.round(numPlayers / 2);
  return matches;
};

var numberOfRounds = function(numPlayers){
  var rounds = 0;
  
  var roundCounter = function(players) {
    var matches = matchesInRound(players);
    
    if (matches === 1) {
      rounds++;
      return;
    } else {
      rounds++;
      roundCounter(matches);
    }
  };

  roundCounter(numPlayers);

  return rounds;
};


exports.matchesInRound = matchesInRound;
exports.numberOfRounds = numberOfRounds;

// for (var i = 1; i < 17; i++){
//   console.log("Players: ", i, "   First round matches: ", matchesInRound(i), "   Number of rounds:", numberOfRounds(i));
// }

// console.log("Players: ", 64, "   First round matches: ", matchesInRound(64), "   Number of rounds:", numberOfRounds(64))
