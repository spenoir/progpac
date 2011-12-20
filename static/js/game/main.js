$(function () {
  var game = new Game({
    tick: 150,
    context: document.getElementById('canvas').getContext('2d'),
    level: LEVEL
  });

  if (CODE) {
    game.start(CODE);
  } else {
    game.redraw();
  }
});