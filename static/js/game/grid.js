/* This file contains Grid object implementation.
 * The object has ability to write grid on canvas.
 * It requires init.js file.
 */


/* Grid object has ability to draw grid on canvas,
 */
var Grid = (function () {
  var nullDrawer = function (ctx, x, y) {};

  var defaults = {
    x: 0,
    y: 0,
    rows: 30,
    cols: 30,
    cellWidth: 10,
    cellHeight: 10,
    radius: 3,
    gridStrokeStyle: "#cccccc",
    cellDrawer: nullDrawer,
    cellDrawerGetter: {
      get: function (r, c) {
	return nullDrawer;
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
    this.radius     = opts.radius     || defaults.radius;
    this.cellDrawer = opts.cellDrawer || defaults.cellDrawer;
    this.cellDrawerGetter = opts.cellDrawerGetter || defaults.cellDrawerGetter;
    this.gridStrokeStyle  = opts.gridStrokeStyle  || defaults.gridStrokeStyle;
  };
})();


Grid.method('chooseCellDrawer', function (given) {
  return given || this.cellDrawer;
});


Grid.method('drawRect', function (ctx, x, y, cellDrawer) {
  var width = this.cellWidth;
  var height = this.cellHeight;
  var radius = this.radius;

  ctx.strokeStyle = this.gridStrokeStyle;
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);

  this.chooseCellDrawer(cellDrawer)(ctx, x, y);

  ctx.stroke();
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
      this.drawRect(ctx, x + (r * width), y + (c * height), getter.get(r, c));
});
