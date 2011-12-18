var Pac = (function () {
  var defaults = {
    row: 0,
    col: 0,
  };
  return function (opts) {
    var o = opts || {};
    this.row = o.row || defaults.row;
    this.col = o.col || defaults.col;
    this.score = 0;
  }
})();


Pac.method('draw', function (ctx, r, c, x, y, w, h) {
  if (r === this.row && c === this.col)
    Drawing.pacmanDrawer.draw(ctx, r, c, x, y, w, h);
});


Pac.method('addScore', function (gridmodel) {
  this.score += gridmodel.visit(this.row, this.col);
});


Pac.method('move', function (direction) {
  switch (direction) {
  case "n": this.row--; break;
  case "s": this.row++; break;
  case "e": this.col--; break;
  case "w": this.col++; break;
  default:
    (console.log || function (whatever) {})("Wrong direction: " + direction);
  }
});
