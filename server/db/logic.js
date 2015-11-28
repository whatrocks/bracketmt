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
