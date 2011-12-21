/* This file contains Grid object implementation.
 * The object has ability to write grid on canvas.
 * It requires init.js file.
 */


/* Grid object has ability to draw grid on canvas,
 */
var Grid = (function () {
  var defaults = {
    x: 0,
    y: 0,
    rows: 30,
    cols: 30,
    cellWidth: 10,
    cellHeight: 10,
    cellDrawer: Drawing.nullDrawer.draw,
    cellDrawerGetter: {
      get: function (r, c) {
	return Drawing.nullDrawer.draw;
      }
    }
  }
  return function (opts) {
    var opts = opts || {};
    this.x          = opts.x || defaults.x;
    this.y          = opts.y || defaults.y;
    this.rows       = opts.rows || defaults.rows;
    this.cols       = opts.cols || defaults.cols;
    this.cellWidth  = opts.cellWidth  || defaults.cellWidth;
    this.cellHeight = opts.cellHeight || defaults.cellHeight;
    this.cellDrawer = opts.cellDrawer || defaults.cellDrawer;
    this.cellDrawerGetter = opts.cellDrawerGetter || defaults.cellDrawerGetter;
  };
})();


Grid.method('chooseCellDrawer', function (given) {
  return given || this.cellDrawer;
});


Grid.method('drawRect', function (ctx, r, c, x, y, cellDrawer) {
  this.chooseCellDrawer(cellDrawer)(ctx, r, c, x, y, this.cellWidth, this.cellHeight);
});


Grid.method('chooseCellDrawerGetter', function (givenGetter) {
  return givenGetter || this.cellDrawerGetter;
})


Grid.method('redraw', function (ctx, givenGetter) {
  var getter = this.chooseCellDrawerGetter(givenGetter);
  var width = this.cellWidth;
  var height = this.cellHeight;
  var x = this.x;
  var y = this.y;

  ctx.clearRect(0, 0, 500, 500);
  for (var r = 0; r < this.rows; r++)
    for (var c = 0; c < this.cols; c++)
      this.drawRect(ctx, r, c, x + (c * width), y + (r * height), getter.get(r, c));
});
