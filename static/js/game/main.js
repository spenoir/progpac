$(function () {
  var game = new Game({
    tick: 150,
    context: document.getElementById('canvas').getContext('2d'),
    level: LEVEL
  });
  game.start("ssssswwwwwnnnnn")
});