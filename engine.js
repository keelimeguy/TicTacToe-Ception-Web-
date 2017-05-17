define([
  'crafty'
], function(crafty){
  var Engine = function(game){
    var that = this;
    this.game = game;
    this.squares = [];
    this.h = 9;
    this.w = 9;
    this.grid = {
      width:  Math.min((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)/12, (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)/12),
      height: Math.min((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)/12, (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)/12),
	  borderIn: Math.min(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)/12)/13, ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)/12)/13),
      borderOut: Math.min(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)/12)/6, ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)/12)/6)
    };
    this.square = Crafty.c('Square', {
      init : function() {
        this.requires('2D, DOM, Color, Mouse');
      },
      setPosition : function(pos) {
        this.pos = pos;
        return this;
      },
      setPlayer : function(player, playerOver) {
		if (player === game.sign.ACTIVE){
		  /*if (playerOver === game.sign.X)
			this.color("rgba(240, 255, 240, 1)");
		  else if (playerOver === game.sign.O)
			this.color("rgba(240, 240, 255, 1)");
	      else*/
			this.color("rgba(255, 255, 255, 1)");
          // add a click event for unplayed cells
          if(!game.testEndGameConditions()){
            this.bind('Click', function(){
              game.playTicTacToeSign(this.pos.x,this.pos.y);
              //console.log('clicked');
              //console.log(game.testGameSomeoneWon());
              that.draw();
              if(game.testEndGameConditions()){
                //console.log('end');
              }
            });
          } 
        } else if (player === game.sign.INACTIVE){
		  /*if (playerOver === game.sign.X)
			this.color("rgba(160, 220, 160, 1)");
		  else if (playerOver === game.sign.O)
			this.color("rgba(160, 160, 220, 1)");
	      else*/
			this.color("rgba(200, 200, 200, 1)");
		} else if (player === game.sign.GAMEOVER_O){
          this.color("rgba(0, 0, 190, .5)");
		} else if (player === game.sign.GAMEOVER_X){
          this.color("rgba(0, 190, 0, .5)");
		} else if (player === game.sign.X){
		  /*if (playerOver === game.sign.X)
			this.color("rgba(0, 255, 0, 1)");
		  else if (playerOver === game.sign.O)
			this.color("rgba(0, 200, 100, 1)");
	      else*/
			this.color("rgba(0, 255, 0, 1)");
        } else if (player === game.sign.O){
		  /*if (playerOver === game.sign.X)
			this.color("rgba(0, 100, 200, 1)");
		  else if (playerOver === game.sign.O)
			this.color("rgba(0, 0, 255, 1)");
	      else*/
			this.color("rgba(0, 0, 255, 1)");
        }
        if (game.testGameSomeoneWon()){
          //console.log('win');
        }
        return this;
      }
    });
    this.width = function(){
      return this.grid.width * this.w + 3*this.grid.borderIn;
    };
    this.height = function(){
      return this.grid.height * this.h + 3*this.grid.borderIn;
    };
    this.draw = function(){
      var scoreBoard = document.querySelector("#score");
	  if (that.game.difficulty == 1)
		scoreBoard.textContent = "Current difficulty: Medium\n\n"+"Wins : " + that.game.score.wins + " Draws : " + that.game.score.draws + " Losses : " + that.game.score.losses;
	  else if (that.game.difficulty == 2)
		scoreBoard.textContent = "Current difficulty: Hard\n\n"+"Wins : " + that.game.score.wins + " Draws : " + that.game.score.draws + " Losses : " + that.game.score.losses;
      else if (that.game.difficulty == 3)
		scoreBoard.textContent = "Current difficulty: Near Impossible\n\n"+"Wins : " + that.game.score.wins + " Draws : " + that.game.score.draws + " Losses : " + that.game.score.losses;
	  for (var x = 0; x < that.game.ticTacToeBoard.length; x++) {
        for (var y = 0; y < that.game.ticTacToeBoard[x].length; y++) {
          var pos = {x: x, y :y};
		  var borderX;
		  var borderY;
		  if(x!=0 && x%3 == 0)
			borderX = that.grid.borderOut;
          else
			borderX = that.grid.borderIn;  
		  if(y!=0 && y%3 == 0)
			borderY = that.grid.borderOut;
          else
			borderY = that.grid.borderIn;
		  var addX;
		  if (x>3)
			  addX = that.grid.borderIn;
		  else
			  addX = 0;
		  var addX;
		  if (y>3)
			  addY = that.grid.borderIn;
		  else
			  addY = 0;
		  if (x>6)
			  addX += that.grid.borderIn;
		  if (y>6)
			  addY += that.grid.borderIn;
		  var square = Crafty.e("Square")
          .attr({
            w : (that.grid.width - that.grid.borderIn),
            h : (that.grid.height - that.grid.borderIn),
            x : (that.grid.width  * x + addX + borderX),
            y : (that.grid.height * y + addY + borderY)
          })
          .setPosition(pos)
          .setPlayer(that.game.ticTacToeBoard[x][y], that.game.ticTacToeOverBoard[Math.floor(x/3)][Math.floor(y/3)]);
        };
      };
    };
    return {
      init : function(){
        Crafty.init(that.height(),that.width());
        //console.log("height: "+that.height());
        //console.log("width: "+that.width());
        Crafty.background('black');
      },
      draw : this.draw,
      restart : function(diff){
		if (typeof diff === "undefined") { diff = -1; }
		if(diff != -1)
			that.game.turn = 2;
        Crafty.init(that.height(),that.width());
        Crafty.background('black');
        that.game.tryAgain(diff);
        that.draw();
      }
    };
  }
  return Engine;
});
