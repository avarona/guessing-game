var generateWinningNumber = function() {
  return Math.floor(Math.random() * 100 + 1);
}

var shuffle = function(array) {
  var m = array.length;
  var t, i;
  while(m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

var newGame = function() {
  return new Game();
}

var Game = function() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();

  Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
  }

  Game.prototype.playersGuessSubmission = function(num) {
    this.playersGuess = num;
    if(isNaN(num) || num < 1 || num > 100) {
      throw "That is an invalid guess.";
    }
    return this.checkGuess();
  }

  Game.prototype.checkGuess = function() {
    console.log(this.winningNumber);
    if(this.playersGuess === this.winningNumber) {
      $("#submit, #hint").prop("disabled", true);
      $("#subtitle").text("Press the Reset button to play again.");
      return "You Win!";
    } else {
      if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return "You have already guessed that number.";
      } else {
        this.pastGuesses.push(this.playersGuess);
        $("#guess-list li:nth-child(" + this.pastGuesses.length + ")").text(this.playersGuess).hide().fadeIn("slow");
        if(this.pastGuesses.length === 5) {
          $("#submit, #hint").prop("disabled", true);
          $("#subtitle").text("Press the Reset button to play again.").hide().fadeIn("slow");
          return "You Lose.";
        } else {
          if(this.isLower()) {
            $("#subtitle").text("Guess Higher!");
          } else {
            $("#subtitle").text("Guess Lower!");
          }
          if(this.difference() < 10) {
            return "You're burning up!";
          } else if(this.difference() < 25) {
            return "You're lukewarm.";
          } else if(this.difference() < 50) {
            return "You're a bit chilly.";
          } else {
            return "You're ice cold!";
          }
        }
      }
    }
  }

  Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(),generateWinningNumber()]);
  }
}

var makeGuess = function(game) {
  var guess = $("#player-input").val();
  $("#player-input").val("");
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $("#title").text(output).hide().fadeIn("slow");
}

$(document).ready(function() {
  var game = new Game();

  $("#submit").click(function(elem) {
    makeGuess(game);
  });

  $("#player-input").keypress(function(event) {
    if(event.which === 13) {
      makeGuess(game);
    }
  });

  $("#reset").click(function() {
    game = newGame();
    $("#submit, #hint").prop("disabled", false);
    $("#title").text("Guessing Game");
    $("#subtitle").text("Guess a number between 1-100!");
    $("#guess-list li").text("");
  });

  $("#hint").click(function() {
    var hints = game.provideHint();
    $("#title").text("The winning number is either " + hints[0] + ", " + hints[1] + " or " + hints[2]);
  });

});
