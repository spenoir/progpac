$(function () {
  var canvas = document.getElementById('canvas');
  var game = new Game({
    tick: 150,
    context: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
    level: LEVEL
  });

  if (CODE) {
    game.redraw();
    game.start(CODE);
  } else {
    game.redraw();
  }
});