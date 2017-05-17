require.config({
  paths: {
    crafty : 'crafty'
  }
});

define(
  [
  'ttt',
  'engine'
], function(Game, Engine){
  document.getElementById('hero').style.width = screen.width;
  document.getElementById('hero').setAttribute("style", "text-align: center");
  //console.log(screen.width);
  ticTacToe = new Game();
  ticTacToe.startTicTacToe(1, 1);
  engine = new Engine(ticTacToe);
  engine.init();
  engine.draw();
  window.ttt = ticTacToe;
  window.engine = engine;
 });
