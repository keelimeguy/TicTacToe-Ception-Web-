define([], function(){
  var TicTacToe = function() {
    this.score = {
      wins:  0,
      draws: 0,
      losses: 0
    }
    // Data structure for a grid position
    var Pos = function(x,y){
      return {
        'x' : x,
        'y' : y
      }
    };
    // signs enum
    this.sign = {
      ACTIVE: 0,
      INACTIVE: 1,
	  X : 2,
      O : 3,
	  GAMEOVER_X : 4,
	  GAMEOVER_O : 5
    };
    // states enum
    this.state = {
      PLAYING : 0,
      NOBODY_WINS : 1,
      YOU_LOSE : 2,
	  YOU_WIN : 3
    };
    // minimaxReturn value object
    this.minimaxReturnValue = function(){
      return {
        bestPosition : null,
        bestScore    : null
      }
    };
    var that = this;
    this.clone = function (board) {
      // Create the new board
      var newBoard = [];
      for (var i = 0; i < board.length; i++) {
        newBoard.push(board[i].slice(0));
      }
      // Return the new board
      return newBoard;
    };
	this.cloneInner = function (board, x, y) {
      // Create the new board
      var newBoard = [];
      for (var i = 0; i < 3; i++) {
        newBoard.push(board[i+3*x].slice(3*y, 3*(y+1)));
      }
      // Return the new board
      return newBoard;
    };
    this.evaluate = function (board, x, y) {
      // The score
      var score = 0;

      // Evaluate all the lines
      score += this.evaluateLine(board, 3*x, 3*y, 3*x + 1, 3*y, 3*x + 2, 3*y);
      score += this.evaluateLine(board, 3*x, 3*y + 1, 3*x + 1, 3*y + 1, 3*x + 2, 3*y + 1);
      score += this.evaluateLine(board, 3*x, 3*y + 2, 3*x + 1, 3*y + 2, 3*x + 2, 3*y + 2);
      score += this.evaluateLine(board, 3*x, 3*y, 3*x, 3*y + 1, 3*x, 3*y + 2);
      score += this.evaluateLine(board, 3*x + 1, 3*y, 3*x + 1, 3*y + 1, 3*x + 1, 3*y + 2);
      score += this.evaluateLine(board, 3*x + 2, 3*y, 3*x + 2, 3*y + 1, 3*x + 2, 3*y + 2);
      score += this.evaluateLine(board, 3*x, 3*y, 3*x + 1, 3*y + 1, 3*x + 2, 3*y + 2);
      score += this.evaluateLine(board, 3*x, 3*y + 2, 3*x + 1, 3*y + 1, 3*x + 2, 3*y);

      // Return the score
      return score;
    };
	this.evaluateWhole = function (board) {
      // The score
      var score = 0;

      // Evaluate all the lines
      score += this.evaluateLine(board, 0, 0, 1, 0, 2, 0);
      score += this.evaluateLine(board, 0, 1, 1, 1, 2, 1);
      score += this.evaluateLine(board, 0, 2, 1, 2, 2, 2);
      score += this.evaluateLine(board, 0, 0, 0, 1, 0, 2);
      score += this.evaluateLine(board, 1, 0, 1, 1, 1, 2);
      score += this.evaluateLine(board, 2, 0, 2, 1, 2, 2);
      score += this.evaluateLine(board, 0, 0, 1, 1, 2, 2);
      score += this.evaluateLine(board, 0, 2, 1, 1, 2, 0);

      // Return the score
      return score;
    };
    this.evaluateLine = function (board, row1, col1, row2, col2, row3, col3) {
      // The score
      var score = 0;

      if (board[row1][col1] == that.sign.O)
        score = 1;
      else if (board[row1][col1] == that.sign.X)
        score = -1;
      if (board[row2][col2] == that.sign.O) {
        if (score == 1)
          score = 10;
        else if (score == -1)
          return 0;
        else
          score = 1;
      } else if (board[row2][col2] == that.sign.X) {
        if (score == 1)
          return 0;
        else if (score == -1)
          score = -10;
        else
          score = -1;
      }
      if (board[row3][col3] == that.sign.O) {
        if (score > 0)
          score *= 10;
        else if (score < 0)
          return 0;
        else
          score = 1;
      } else if (board[row3][col3] == that.sign.X) {
        if (score > 0)
          return 0;
        else if (score < 0)
          score *= 10;
        else
          score = -1;
      }
      // Return the score
      return score;
    };
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	
	this.minimax = function (difficulty, board, overBoard, playerSign, x, y) {
		//console.log("Scoring off difficulty: "+difficulty);
		//console.log("-------------------------------------------------------------------");
		switch (difficulty) {
				case 1:
					return this.minimax1(board, playerSign, x, y);
				break;
				case 2:
					return this.minimax2(board, overBoard, playerSign, x, y);
				break;
				case 3:
					return this.minimax3(board, x, y, overBoard, playerSign);
				break;
			}
	}
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//											Difficulty:	Near Impossible - 3
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	
	this.minimax3 = function (boardi, xi, yi, overBoard, playerSign) {
		var x = xi;
		var y = yi;
		var returnValue = new this.minimaxReturnValue();
		var board = {
			marks: this.cloneInner(boardi, x, y),
			row: x,
			col: y
		};
		if(this.testGameEmpty()) {
			returnValue.bestPosition = new Pos(4,4);
			return returnValue;
		} else if (!this.testGameFullInnerComplete(1,1) && board.marks[1][1]<=that.sign.INACTIVE) {
			returnValue.bestPosition = new Pos(3*x+1,3*y+1);
			return returnValue;
		} else {
			//console.log("else");
			if(!this.sendBoards) {
				this.sendBoards = [board];
				this.bi = 0;
			} 
			if(this.testGameFullInnerComplete(this.sendBoards[this.bi].row, this.sendBoards[this.bi].col)) {
				//console.log("");
				//console.log("prev is full");
				//console.log("");
				//the previous board is full
				var oldBoard = this.sendBoards[this.bi];
				x = 2-oldBoard.row;
				y = 2-oldBoard.col;
				this.bi = this.bi+1;
				var newBoard = {
					marks: this.cloneInner(boardi, x, y),
					row: x,
					col: y
				};
				if(oldBoard.row!=newBoard.row && oldBoard.col!=newBoard.col)
					this.sendBoards.push(newBoard);
				else
					this.bi = this.bi-1;
				board = newBoard;
			} 
			var nonFullBoards = [];
			var curBoard;
			/*for(var i = 0; i<this.sendBoards.length; i++){
				curBoard = this.sendBoards[i];
				if(!this.testGameFullInnerComplete(curBoard.row, curBoard.col)){
					nonFullBoards.push(curBoard);
				}
			}*/
			//console.log("sendboards: "+this.sendBoards);
			for(i = 0; i<this.sendBoards.length; i++){
				curBoard = this.sendBoards[i];
				//console.log("	sendboard: "+i);
				//console.log("	curBoard: "+curBoard.row+", "+curBoard.col);
				//console.log("	board: "+board.row+", "+board.col);
				//console.log("	x,y: "+x+", "+y);
				if(!this.testGameFullInnerComplete(curBoard.row, curBoard.col) && boardi[3*xi+curBoard.row][3*yi+curBoard.col] <= that.sign.INACTIVE) {
					returnValue.bestPosition = new Pos(3*xi+curBoard.row, 3*yi+curBoard.col);
					return returnValue;
				}
			}
			//console.log("");
			//console.log("Mini2");
			//console.log("");
			returnValue = this.minimax2(boardi, overBoard, playerSign, xi, yi);
			if(!this.testGameFullInnerComplete(returnValue.bestPosition.x-3*Math.floor(returnValue.bestPosition.x/3), returnValue.bestPosition.y-3*Math.floor(returnValue.bestPosition.y/3)))
				return returnValue;
			var a=[], b=[];
			for (i=0;i<3;++i) a[i]=i;
				a = this.shuffle(a);
			for (i=0;i<3;++i) b[i]=i;
				b = this.shuffle(b);
			var u = 0, v = 0, fail = false;
			while(this.testGameFullInnerComplete(a[u], b[v]) || boardi[xi*3+a[u]][yi*3+b[v]]>that.sign.INACTIVE){
				u = u+1;
				if(u==3){
					u=0;
					v++;
				}else if(v==3){
					v=2;
					fail = true;
					break;
				}
			}
			if(!fail)
				returnValue.bestPosition = new Pos(xi*3+a[u], yi*3+b[v]);
			return returnValue;
		}
	};
	
	this.shuffle = function (array) {
		var tmp, current, top = array.length;
		if(top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}
		return array;
	}
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//											Difficulty:	Hard - 2
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	
    this.minimax2 = function (board, overBoard, playerSign, x, y, a, b, flip, depth) {
	  if (typeof a === "undefined") { a = x; }
	  if (typeof b === "undefined") { b = y; }
	  if (typeof flip === "undefined") { flip = false; }
	  if (typeof depth === "undefined") { depth = 3; }
		
      // Variables
      var tempBoard;
	  var tempOverBoard;
      var currentScore;
      var returnValue = new that.minimaxReturnValue();
      var gameFull = true;
	  
      if (playerSign == that.sign.O)
        returnValue.bestScore = -99999999;
      else
        returnValue.bestScore = 99999999;
      if (depth > 0) {
        for (var i = 0; i <= 2; i++) {
          for (var j = 0; j <= 2; j++) {
            if (board[x*3+i][y*3+j] <= that.sign.INACTIVE) {
              // We found at least one non-empty cell : the game isn't full
              gameFull = false;

              // Set the temp board from the real board
              tempBoard = this.clone(board);
			  tempOverBoard = this.clone(overBoard);

              // Try to play on this cell using the temp board
              tempBoard[x*3+i][y*3+j] = playerSign;
			  if(tempOverBoard[x][y] <= that.sign.INACTIVE)
				tempOverBoard[x][y] = this.testGameSomeoneWonUnderTemp(x, y, tempBoard);
			  
			  //console.log((x*3+i)+", "+(y*3+j));
			  var baseA = this.minimaxInner2(tempBoard, playerSign, x, y, flip);
			  var base = baseA.bestScore;
			  //var baseO = 100*this.minimaxInner2(tempOverBoard, playerSign, 0, 0, flip).bestScore;
			  var baseO = 10*this.evaluate(tempOverBoard, 0, 0 );
				//for( u = 0; u <= 2; u++)
				//	console.log("   "+tempOverBoard[0][u]+" "+tempOverBoard[1][u]+" "+tempOverBoard[2][u]);
				//console.log("	inner "+depth+" got "+base);
				//console.log("	with over "+baseO);
				//console.log("	for "+(x*3+i)+", "+(y*3+j));
				//console.log("");
			  base = base + baseO;
	  
			  
              if (playerSign == that.sign.O) {
                currentScore = base + this.minimax2(tempBoard, tempOverBoard, that.sign.X, i, j, x, y, true, depth-1).bestScore;//this.minimax(tempBoard, that.sign.X, i, j, depth-1).bestScore;
                //if(depth==3){
				//console.log("											scoreO: "+currentScore);
                //console.log("					base: "+base+"		best: "+(currentScore-base));
				//console.log("					at "+(x*3+i)+", "+(y*3+j));
				//console.log("");}
				
				if (returnValue.bestScore < currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              } else {
                currentScore = base + this.minimax2(tempBoard, tempOverBoard, that.sign.O, i, j, x, y, true, depth-1).bestScore;
				//console.log("				scoreX: "+currentScore);
               // console.log("				base: "+base+"		best: "+(currentScore-base));
				//console.log("				at "+(x*3+i)+", "+(y*3+j));
				//console.log("");
                if (returnValue.bestScore > currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              }
            }
          }
        }
        if (gameFull)
          returnValue.bestScore =  this.evaluate(board, x, y);
      } else{
        returnValue.bestScore =  this.evaluate(board, a, b);
		//if(flip)
		//returnValue.bestScore =  -returnValue.bestScore;
		
	//	atempBoard = this.clone(board);
	//for( var p = 0; p <= 8; p++)
		//		console.log("   "+atempBoard[0][p]+" "+atempBoard[1][p]+" "+atempBoard[2][p]+" "+atempBoard[3][p]+" "+atempBoard[4][p]+" "+atempBoard[5][p]+" "+atempBoard[6][p]+" "+atempBoard[7][p]+" "+atempBoard[8][p]);
	
		  //console.log("  "+a+", "+b);
		  //console.log("  score: "+returnValue.bestScore);
	}
      // Return the return value (best position found + the score)
      
	  return returnValue;
    };
	
	this.minimaxInner2 = function (board, playerSign, x, y, flip, depth) {
      if (typeof depth === "undefined") { depth = 2; }
      // Variables
      var tempBoard;
      var currentScore;
      var returnValue = new that.minimaxReturnValue();
      var gameFull = true;

      if ((playerSign == that.sign.O))// && !flip) || (playerSign == that.sign.X && flip))
        returnValue.bestScore = -99999999;
      else
        returnValue.bestScore = 99999999;
	//atempBoard = this.clone(board);
	//for( var p = 0; p <= 8; p++)
		//		console.log("   "+atempBoard[0][p]+" "+atempBoard[1][p]+" "+atempBoard[2][p]+" "+atempBoard[3][p]+" "+atempBoard[4][p]+" "+atempBoard[5][p]+" "+atempBoard[6][p]+" "+atempBoard[7][p]+" "+atempBoard[8][p]);
				
      if (depth > 0) {
        for (var i = 0; i <= 2; i++) {
          for (var j = 0; j <= 2; j++) {
            if (board[x*3+i][y*3+j] <= that.sign.INACTIVE) {
              // We found at least one non-empty cell : the game isn't full
              gameFull = false;

              // Set the temp board from the real board
              tempBoard = this.clone(board);
			  
              // Try to play on this cell using the temp board
              tempBoard[x*3+i][y*3+j] = playerSign;
			  
			  //console.log("For Player "+playerSign);
			// console.log("	"+i+", "+j);
			 //console.log("Depth: "+depth);
			  
              if (playerSign == that.sign.O) {
                currentScore = this.minimaxInner2(tempBoard, that.sign.X, x, y, flip, depth - 1).bestScore;
				//console.log("O:	"+currentScore);
				//console.log("");
				//	for( var p = 0; p <= 8; p++)
				//console.log("   "+tempBoard[0][p]+" "+tempBoard[1][p]+" "+tempBoard[2][p]+" "+tempBoard[3][p]+" "+tempBoard[4][p]+" "+tempBoard[5][p]+" "+tempBoard[6][p]+" "+tempBoard[7][p]+" "+tempBoard[8][p]);
				//console.log("");
				//console.log("  Current: "+currentScore);
			//	console.log("Best:    "+returnValue.bestScore);
				
                if ((/*flip && returnValue.bestScore > currentScore) || (!flip && */(returnValue.bestScore < currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)))) {
           //       console.log("new Best: "+currentScore);
			//  console.log("");
				  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              } else {
                currentScore = this.minimaxInner2(tempBoard, that.sign.O, x, y, flip, depth - 1).bestScore;
              //  console.log("	X:	"+currentScore);
				//console.log("");
					//for( var p = 0; p <= 8; p++)
				//console.log("   "+tempBoard[0][p]+" "+tempBoard[1][p]+" "+tempBoard[2][p]+" "+tempBoard[3][p]+" "+tempBoard[4][p]+" "+tempBoard[5][p]+" "+tempBoard[6][p]+" "+tempBoard[7][p]+" "+tempBoard[8][p]);
				//console.log("  Current: "+currentScore);
				//console.log("	Best:    "+returnValue.bestScore);
				
				if ((/*flip && returnValue.bestScore < currentScore) || (!flip && */(returnValue.bestScore > currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)))) {
			//	  console.log("	new Best: "+currentScore);
			//  console.log("");
				  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              }
            }
          }
        }

        if (gameFull)
          returnValue.bestScore = this.evaluate(board, x, y);
      } else{
        returnValue.bestScore = this.evaluate(board, x, y);
		if(playerSign == that.sign.X);
		//console.log("					First eval: "+returnValue.bestScore);
	  }
      // Return the return value (best position found + the score)
      return returnValue;
    };

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//											Difficulty:	Medium - 1
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	
	this.minimax1 = function (board, playerSign, x, y, flip,  depth) {
	  if (typeof flip === "undefined") { flip = false; }
	  if (typeof depth === "undefined") { depth = 2; }
		
      // Variables
      var tempBoard;
      var currentScore;
      var returnValue = new that.minimaxReturnValue();
      var gameFull = true;
	  
      if (playerSign == that.sign.O)
        returnValue.bestScore = -99999999;
      else
        returnValue.bestScore = 99999999;

      if (depth > 0) {
        for (var i = 0; i <= 2; i++) {
          for (var j = 0; j <= 2; j++) {
            if (board[x*3+i][y*3+j] <= that.sign.INACTIVE) {
              // We found at least one non-empty cell : the game isn't full
              gameFull = false;

              // Set the temp board from the real board
              tempBoard = this.clone(board);

              // Try to play on this cell using the temp board
              tempBoard[x*3+i][y*3+j] = playerSign;
			  //console.log((x*3+i)+", "+(y*3+j));
			  var baseA = this.minimaxInner1(tempBoard, playerSign, x, y, flip)
			  var base = baseA.bestScore;
				//console.log("			inner "+depth+" got "+base);
				//console.log("			for "+(x*3+i)+", "+(y*3+j));
	  
			  
              if (playerSign == that.sign.O) {
                currentScore = base + this.minimax1(tempBoard, that.sign.X, i, j, true, depth-1).bestScore;//this.minimax(tempBoard, that.sign.X, i, j, depth-1).bestScore;
                //console.log("				score: "+currentScore);
                //console.log("				base: "+base+"		best: "+(currentScore-base));
				//console.log("				at "+(x*3+i)+", "+(y*3+j));
				//console.log("");
				if (returnValue.bestScore < currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              } else {
                currentScore = base + this.minimax1(tempBoard, that.sign.O, i, j, true, depth-1).bestScore;
                if (returnValue.bestScore > currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              }
            }
          }
        }
		
        if (gameFull)
          returnValue.bestScore =  this.evaluate(board, x, y);
      } else
        returnValue.bestScore =  this.evaluate(board, x, y);
	
      // Return the return value (best position found + the score)
      
	  return returnValue;
    };
	
	this.minimaxInner1 = function (board, playerSign, x, y, flip, depth) {
      if (typeof depth === "undefined") { depth = 2; }
      // Variables
      var tempBoard;
      var currentScore;
      var returnValue = new that.minimaxReturnValue();
      var gameFull = true;

      if ((playerSign == that.sign.O && !flip) || (playerSign == that.sign.X && flip))
        returnValue.bestScore = -99999999;
      else
        returnValue.bestScore = 99999999;
	//atempBoard = this.clone(board);
	//for( var p = 0; p <= 8; p++)
		//		console.log("   "+atempBoard[0][p]+" "+atempBoard[1][p]+" "+atempBoard[2][p]+" "+atempBoard[3][p]+" "+atempBoard[4][p]+" "+atempBoard[5][p]+" "+atempBoard[6][p]+" "+atempBoard[7][p]+" "+atempBoard[8][p]);
				
      if (depth > 0) {
        for (var i = 0; i <= 2; i++) {
          for (var j = 0; j <= 2; j++) {
            if (board[x*3+i][y*3+j] <= that.sign.INACTIVE) {
              // We found at least one non-empty cell : the game isn't full
              gameFull = false;

              // Set the temp board from the real board
              tempBoard = this.clone(board);
			  
              // Try to play on this cell using the temp board
              tempBoard[x*3+i][y*3+j] = playerSign;
			  
			  //console.log("For Player "+playerSign);
			 //console.log("	"+i+", "+j);
			  
              if (playerSign == that.sign.O) {
                currentScore = this.minimaxInner1(tempBoard, that.sign.O, x, y, flip, depth - 1).bestScore;
				//console.log("		O:	"+currentScore);
				/*console.log("");
					for( var p = 0; p <= 8; p++)
				console.log("   "+tempBoard[0][p]+" "+tempBoard[1][p]+" "+tempBoard[2][p]+" "+tempBoard[3][p]+" "+tempBoard[4][p]+" "+tempBoard[5][p]+" "+tempBoard[6][p]+" "+tempBoard[7][p]+" "+tempBoard[8][p]);
				console.log("");*/
				//console.log("  Current: "+currentScore);
				//console.log("  Best:    "+returnValue.bestScore);
				
                if ((flip && returnValue.bestScore > currentScore) || (!flip && (returnValue.bestScore < currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)))) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              } else {
                currentScore = this.minimaxInner1(tempBoard, that.sign.X, x, y, flip, depth - 1).bestScore;
                //console.log("		X:	"+currentScore);
				/*console.log("");
					for( var p = 0; p <= 8; p++)
				console.log("   "+tempBoard[0][p]+" "+tempBoard[1][p]+" "+tempBoard[2][p]+" "+tempBoard[3][p]+" "+tempBoard[4][p]+" "+tempBoard[5][p]+" "+tempBoard[6][p]+" "+tempBoard[7][p]+" "+tempBoard[8][p]);
				*///console.log("  Current: "+currentScore);
				//console.log("  Best:    "+returnValue.bestScore);
				
				if ((flip && returnValue.bestScore < currentScore) || (!flip && (returnValue.bestScore > currentScore || (returnValue.bestScore == currentScore && Math.floor(Math.random()*2)==1)))) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(x*3+i, y*3+j);
                }
              }
            }
          }
        }

        if (gameFull)
          returnValue.bestScore = this.evaluate(board, x, y);
      } else
        returnValue.bestScore = this.evaluate(board, x, y);

      // Return the return value (best position found + the score)
      return returnValue;
    };
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------------------------------------------------
	
    this.testEndGameConditions = function () {
	  
	  // Nothing happens, we return false
	  var gameover = false;

	  for (var i = 0; i < 3; i++) {
		  for (var j = 0; j < 3; j++) {
			if(this.ticTacToeOverBoard[i][j] <= that.sign.INACTIVE){
				this.ticTacToeOverBoard[i][j] = this.testGameSomeoneWonUnder(i, j);
			}
		  }
	  }

	  switch (this.testGameSomeoneWonOver()) {
				case that.sign.O:
					this.ticTacToeStep = that.state.YOU_LOSE;
				    gameover = true;
					this.setBoardGameOver(that.sign.O);
				break;
				case that.sign.X:
					// add object to the player here
					this.ticTacToeStep = that.state.YOU_WIN;
				    gameover = true;
					this.setBoardGameOver(that.sign.X);
				break;
			}
	  
      if (gameover == false && this.testGameFull()) {
        this.ticTacToeStep = that.state.NOBODY_WINS;
        gameover = true;
      }

      
      return gameover;
    };
	
	this.testGameSomeoneWon = function () {
	  for (var i = 0; i < 3; i++) {
		  for (var j = 0; j < 3; j++) {
			if(this.ticTacToeOverBoard[i][j] <= that.sign.INACTIVE)
				this.ticTacToeOverBoard[i][j] = this.testGameSomeoneWonUnder(i, j);
		  }
	  }

	  return this.testGameSomeoneWonOver();
    };

	this.testGameEmpty = function () {
      // Variables
      var isFull = true;

      for (var i = 0; i <= 8; i++) {
        for (var j = 0; j <= 8; j++) {
          if (this.ticTacToeBoard[i][j] > that.sign.INACTIVE) {
            isFull = false;
            break;
          }
        }
        if (isFull == false)
          break;
      }

      if (isFull)
        return true;

      // Else, return false
      return false;
    };
	
    this.testGameFull = function () {
      // Variables
      var isFull = true;

      for (var i = 0; i <= 8; i++) {
        for (var j = 0; j <= 8; j++) {
          if (this.ticTacToeBoard[i][j] <= that.sign.INACTIVE) {
            isFull = false;
            break;
          }
        }
        if (isFull == false)
          break;
      }

      if (isFull)
        return true;

      // Else, return false
      return false;
    };
	
	this.testGameFullInner = function (x, y) {
      // Variables
      var isFull = true;

      for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
          if (this.ticTacToeBoard[i+3*x][j+3*y] <= that.sign.INACTIVE) {
            isFull = false;
            break;
          }
        }
        if (isFull == false)
          break;
      }

      if (isFull)
        return true;

      // Else, return false
      return false;
    };
	
	this.testGameFullInnerComplete = function (x, y, cnt) {
		if (typeof cnt === "undefined") {cnt = 2;}
      // Variables
      var isFull = true;
	  if(cnt == 0){
		  for (var i = 0; i <= 2; i++) {
			for (var j = 0; j <= 2; j++) {
			  if (this.ticTacToeBoard[i+3*x][j+3*y] <= that.sign.INACTIVE && !this.testGameFullInner(i, j)) {
				isFull = false;
				break;
			  }
			}
			if (isFull == false)
			  break;
		  }
		  return isFull;
	  }
	  for (var i = 0; i <= 2; i++) {
		for (var j = 0; j <= 2; j++) {
		  if (this.ticTacToeBoard[i+3*x][j+3*y] <= that.sign.INACTIVE && !this.testGameFullInnerComplete(i, j, cnt-1)) {
			isFull = false;
			break;
		  }
		}
		if (isFull == false)
		  break;
	  }

      if (isFull)
        return true;

      // Else, return false
      return false;
    };

    this.testGameSomeoneWonUnder = function (x, y) {
      // Variables
      var returnSign;

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowUnder(i, 0, 0, 1, x, y);
        if (returnSign != null)
          return returnSign;
      }

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowUnder(0, i, 1, 0, x, y);
        if (returnSign != null)
          return returnSign;
      }

      if ((returnSign = this.threeInARowUnder(0, 0, 1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(0, 1, 1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(1, 0, 1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(0, 2, 1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(2, 0, 1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(4, 0, -1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(3, 1, -1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(3, 0, -1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(4, 2, -1, 1, x, y)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnder(2, 0, -1, 1, x, y)) != null)
        return returnSign;

      // No one won, we return NO_SIGN
      return that.sign.INACTIVE;
    };
	
	this.testGameSomeoneWonUnderTemp = function (x, y, board) {
      // Variables
      var returnSign;

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowUnderTemp(i, 0, 0, 1, x, y, board);
        if (returnSign != null)
          return returnSign;
      }

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowUnderTemp(0, i, 1, 0, x, y, board);
        if (returnSign != null)
          return returnSign;
      }

      if ((returnSign = this.threeInARowUnderTemp(0, 0, 1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(0, 1, 1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(1, 0, 1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(0, 2, 1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(2, 0, 1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(4, 0, -1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(3, 1, -1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(3, 0, -1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(4, 2, -1, 1, x, y, board)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowUnderTemp(2, 0, -1, 1, x, y, board)) != null)
        return returnSign;

      // No one won, we return NO_SIGN
      return that.sign.INACTIVE;
    };

	this.testGameSomeoneWonOver = function () {
      // Variables
      var returnSign;

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowOver(i, 0, 0, 1);
        if (returnSign != null)
          return returnSign;
      }

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARowOver(0, i, 1, 0);
        if (returnSign != null)
          return returnSign;
      }

      if ((returnSign = this.threeInARowOver(0, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(0, 1, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(1, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(0, 2, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(2, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(4, 0, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(3, 1, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(3, 0, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(4, 2, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARowOver(2, 0, -1, 1)) != null)
        return returnSign;

      // No one won, we return NO_SIGN
      return that.sign.INACTIVE;
    };
	
    this.threeInARowUnder = function (x1, y1, x2, y2, i, j) {
      // Variables
      var column = x1;
      var row = y1;
      var counter = 0;
      var currentSign = null;

      while (column >= 0 && column < 3 && row >= 0 && row < 3) {
        if (this.ticTacToeBoard[column+i*3][row+j*3] != that.sign.ACTIVE && this.ticTacToeBoard[column+i*3][row+j*3] != that.sign.INACTIVE) {
          if (this.ticTacToeBoard[column+i*3][row+j*3] != currentSign) {
            currentSign = this.ticTacToeBoard[column+i*3][row+j*3];
            counter = 1;
          } else
            counter++;
        } else
          counter = 0;

        if (currentSign != null && counter == 3)
          return currentSign;

        column += x2;
        row += y2;
      }

      return null;
    };
	
	this.threeInARowUnderTemp = function (x1, y1, x2, y2, i, j, board) {
      // Variables
      var column = x1;
      var row = y1;
      var counter = 0;
      var currentSign = null;

      while (column >= 0 && column < 3 && row >= 0 && row < 3) {
        if (board[column+i*3][row+j*3] != that.sign.ACTIVE && board[column+i*3][row+j*3] != that.sign.INACTIVE) {
          if (board[column+i*3][row+j*3] != currentSign) {
            currentSign = board[column+i*3][row+j*3];
            counter = 1;
          } else
            counter++;
        } else
          counter = 0;

        if (currentSign != null && counter == 3)
          return currentSign;

        column += x2;
        row += y2;
      }

      return null;
    };
	
	this.threeInARowOver = function (x1, y1, x2, y2) {
      // Variables
      var column = x1;
      var row = y1;
      var counter = 0;
      var currentSign = null;

      while (column >= 0 && column < 3 && row >= 0 && row < 3) {
        if (this.ticTacToeOverBoard[column][row] != that.sign.ACTIVE && this.ticTacToeOverBoard[column][row] != that.sign.INACTIVE) {
          if (this.ticTacToeOverBoard[column][row] != currentSign) {
            currentSign = this.ticTacToeOverBoard[column][row];
            counter = 1;
          } else
            counter++;
        } else
          counter = 0;

        if (currentSign != null && counter == 3)
          return currentSign;

        column += x2;
        row += y2;
      }

      return null;
    };

    this.tryAgain = function (diff) {
		//console.log("winner: "+this.testGameSomeoneWon());
	 if(diff==-1) {
      var okay = false;
	  if(this.testGameSomeoneWon())
		  okay = true;
      if(okay && (this.testGameSomeoneWon() == this.sign.X || this.testGameSomeoneWon() == this.sign.GAMEOVER_X)){
        this.score.wins++;
      } else if(okay && (this.testGameSomeoneWon() == this.sign.O || this.testGameSomeoneWon() == this.sign.GAMEOVER_O)){
        this.score.losses++;
      } else
		this.score.draws++;
	  this.startTicTacToe(this.difficulty, this.turn%2 + 1);
     } else {
		 this.score.draws = 0;
		 this.score.losses = 0;
		 this.score.wins = 0;
		 this.startTicTacToe(diff, this.turn%2 + 1);
	 }
	};
	
	this.makeActive = function (x, y) {
		for (var i = 0; i <= 8; i++) {
			for (var j = 0; j <= 8; j++) {
				if(( (i < x * 3) || (i >= ( x + 1 ) * 3)) || ( j < y * 3 || j >= ( y + 1 ) * 3)) {
					if(this.ticTacToeBoard[i][j] == that.sign.ACTIVE)
						this.ticTacToeBoard[i][j] = that.sign.INACTIVE;
				} else {
					if(this.ticTacToeBoard[i][j] == that.sign.INACTIVE)
						this.ticTacToeBoard[i][j] = that.sign.ACTIVE;	
				}
			}
		}
	};
	
	this.setBoardGameOver = function (sign) {
		for (var i = 0; i <= 8; i++) {
			for (var j = 0; j <= 8; j++) {
				if(this.ticTacToeBoard[i][j] <= that.sign.INACTIVE)
					if(sign==this.sign.X)
						this.ticTacToeBoard[i][j] = that.sign.GAMEOVER_X;
					else
						this.ticTacToeBoard[i][j] = that.sign.GAMEOVER_O;
			}
		}
	};
	
    this.playTicTacToeSign = function (xIndex, yIndex) {
      // Add the sign
	  this.ticTacToeBoard[xIndex][yIndex] = that.sign.X;

      if (this.testEndGameConditions() == false) {
		  
		if(this.testGameFullInner(xIndex - 3*Math.floor(xIndex/3), yIndex - 3*Math.floor(yIndex/3))){
			this.ticTacToeBoard[xIndex][yIndex] = that.sign.ACTIVE;
			return;
		}
        
		// AI
        var bestPosition = this.minimax(this.difficulty, this.ticTacToeBoard, this.ticTacToeOverBoard, that.sign.O, xIndex - 3*Math.floor(xIndex/3), yIndex - 3*Math.floor(yIndex/3)).bestPosition;
        this.ticTacToeBoard[bestPosition.x][bestPosition.y] = that.sign.O;
		
		//console.log("x-click: "+xIndex);
		//console.log("y-click: "+yIndex);
		//console.log("best-x: "+bestPosition.x);
		//console.log("best-y: "+bestPosition.y);
		//console.log("board: ");
		//for( i = 0; i <= 8; i++)
		//		console.log("   "+this.ticTacToeBoard[0][i]+" "+this.ticTacToeBoard[1][i]+" "+this.ticTacToeBoard[2][i]+" "+this.ticTacToeBoard[3][i]+" "+this.ticTacToeBoard[4][i]+" "+this.ticTacToeBoard[5][i]+" "+this.ticTacToeBoard[6][i]+" "+this.ticTacToeBoard[7][i]+" "+this.ticTacToeBoard[8][i]);
		//console.log("over board: ");
		//for( i = 0; i <= 2; i++)
		//		console.log("   "+this.ticTacToeOverBoard[0][i]+" "+this.ticTacToeOverBoard[1][i]+" "+this.ticTacToeOverBoard[2][i]);
		this.makeActive(bestPosition.x - 3*Math.floor(bestPosition.x/3), bestPosition.y - 3*Math.floor(bestPosition.y/3));
		
        // Test end game conditions
        this.testEndGameConditions();
      }
      
	  // Update
      //this.update();
      //this.getGame().updatePlace();
    };
	
	this.playTicTacToeSignComputerFirst = function () {
		var xIndex = Math.floor(Math.random()*3);
		var yIndex = Math.floor(Math.random()*3);
		
		// AI
        var bestPosition = this.minimax(this.difficulty, this.ticTacToeBoard, this.ticTacToeOverBoard, that.sign.O, xIndex, yIndex).bestPosition;
        this.ticTacToeBoard[bestPosition.x][bestPosition.y] = that.sign.O;
		
		//console.log("x-click: "+xIndex);
		//console.log("y-click: "+yIndex);
		//console.log("best-x: "+bestPosition.x);
		//console.log("best-y: "+bestPosition.y);
		//console.log("board: ");
		//for( i = 0; i <= 8; i++)
		//		console.log("   "+this.ticTacToeBoard[0][i]+" "+this.ticTacToeBoard[1][i]+" "+this.ticTacToeBoard[2][i]+" "+this.ticTacToeBoard[3][i]+" "+this.ticTacToeBoard[4][i]+" "+this.ticTacToeBoard[5][i]+" "+this.ticTacToeBoard[6][i]+" "+this.ticTacToeBoard[7][i]+" "+this.ticTacToeBoard[8][i]);
		//console.log("over board: ");
		//for( i = 0; i <= 2; i++)
		//		console.log("   "+this.ticTacToeOverBoard[0][i]+" "+this.ticTacToeOverBoard[1][i]+" "+this.ticTacToeOverBoard[2][i]);
		this.makeActive(bestPosition.x - 3*Math.floor(bestPosition.x/3), bestPosition.y - 3*Math.floor(bestPosition.y/3));
		
        // Test end game conditions
        this.testEndGameConditions();
      
      
	  // Update
      //this.update();
      //this.getGame().updatePlace();
    };
	
    this.startTicTacToe = function (diff, turn) {
		
      // Reset the array
      this.ticTacToeBoard = [];
	  this.ticTacToeOverBoard = [];
	  
	  this.sendBoards;
	  this.difficulty = diff;
	  this.turn = turn;

      for (var i = 0; i < 9; i++) {
        this.ticTacToeBoard.push([]);
        for (var j = 0; j < 9; j++) {
          this.ticTacToeBoard[i].push(that.sign.ACTIVE);
        }
      }
	  
	   for (var i = 0; i < 3; i++) {
        this.ticTacToeOverBoard.push([]);
        for (var j = 0; j < 3; j++) {
          this.ticTacToeOverBoard[i].push(that.sign.ACTIVE);
        }
      }

      // Set the step
      this.ticTacToeStep = that.state.PLAYING;
	  
	  if(turn==2){
		  this.playTicTacToeSignComputerFirst();
	  }
	  
    };
  }
  return TicTacToe;
});
