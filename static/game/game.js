var Game = (function () {
  var defaults = {
    tick: 250
  };
  return function (opts) {
    var opts = opts || {};

    this.tick = opts.tick || defaults.tick;

    this.width = opts.width;
    this.height = opts.height;
    this.context = opts.context;
    this.level = opts.level;

    this.pac = new Pac({
      row: 10,
      col: 10
    });

    this.objects = new GridModel();
    this.objects
      .addDefault(Drawing.cellDrawer)
      .addDefault(this.pac);

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

    var rows = this.level.length;
    var cols = this.level[0].length;

    this.grid = new Grid({
      cellWidth: parseInt(this.width / cols, 10),
      cellHeight: parseInt(this.height / rows, 10),
      rows: rows,
      cols: cols
    });
  };
})();


Game.method('redraw', function () {
  this.grid.redraw(this.context, this.objects.cellGetter);
});


Game.method('start', function (pacpath) {
  var that = this;
  var currentMove = 0;
  var desc = 0;
  var next = function () {
    if (currentMove >= pacpath.length) {
      clearInterval(desc);
    } else {
      var command = pacpath[currentMove];
      that.pac.move(command);
      that.objects.visit(that.pac, command);
      that.redraw();
      currentMove += 1;
    }
  }
  decs = setInterval(next, this.tick);
});