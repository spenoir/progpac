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
      that.grid.redraw(that.context, that.pac.cellDrawerGetter);
      that.pac.move(pacpath[currentMove]);
      currentMove += 1;
    }
  }
  decs = setInterval(next, this.tick);
});