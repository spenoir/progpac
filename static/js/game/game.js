var Game = (function () {
  var defaults = {
    tick: 250
  };
  return function (opts) {
    var opts = opts || {};

    this.pac = new Pac({
      row: 10,
      col: 10
    });

    this.objects = new GridModel();
    this.objects
      .addDefault(this.pac)
      .addDefault(Drawing.cellDrawer);

    this.level = opts.level;

    for (var row = 0; row < this.level.length; row += 1) {
      var line = this.level[row];
      for (var col = 0; col < line.length; col += 1) {
	switch (line[col]) {
	case ".": break;
	case "o": this.objects.set(row, col, new ScoreCell({
	  score: 1,
	  drawables: [Drawing.pointDrawer]
	})); break;
	case "*": this.objects.set(row, col, Drawing.otherPointDrawer); break;
	case "u": this.pac.row = row; this.pac.col = col; break;
	default:
	  this.objects.set(row, col, Drawing.otherPointDrawer);
	}
      };
    };

    this.grid = new Grid({
      cellWidth: 15,
      cellHeight: 15,
      rows: this.level.length,
      cols: this.level[0].length
    });

    this.tick = opts.tick || defaults.tick;
    this.context = opts.context;
  };
})();


Game.method('start', function (pacpath) {  // pacpath is eg. "sssswwwewe"
  var that = this;
  var currentMove = 0;
  var desc = 0;
  var next = function () {
    if (currentMove >= pacpath.length) {
      clearInterval(desc);
    } else {
      that.grid.redraw(that.context, that.objects.cellGetter);
      that.pac.move(pacpath[currentMove]);
      that.pac.addScore(that.objects);
      currentMove += 1;
    }
  }
  decs = setInterval(next, this.tick);
});