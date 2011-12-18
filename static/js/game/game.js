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
      .addDefault(Drawing.cellDrawer)
      .set(4, 4, new ScoreCell({
	score: 1,
	drawables: [Drawing.pointDrawer]
      }))
      .set(10, 15, new ScoreCell({
	score: 1,
	drawables: [Drawing.pointDrawer]
      }))
    ;

    this.grid = new Grid({
      cellWidth: 15,
      cellHeight: 15
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