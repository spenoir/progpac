var Pac = (function () {
  var defaults = {
    row: 0,
    col: 0,
    drawer: function (ctx, x, y) {
      ctx.fill();
    }
  };
  return function (opts) {
    var o = opts || {};
    this.row = o.row || defaults.row;
    this.col = o.col || defaults.col;
    this.drawer = o.drawer || defaults.drawer;
    this.cellDrawerGetter = (function (that) {
      return {
	get: function (r, c) {
	  if (r === that.row && c === that.col) {
	    return that.drawer;
	  }
	}
      }
    })(this);
  }
})();


Pac.method('move', function (direction) {
  switch (direction) {
  case "n": this.col--; break;
  case "s": this.col++; break;
  case "e": this.row--; break;
  case "w": this.row++; break;
  default:
    (console.log || function (whatever) {})("Wrong direction: " + direction);
  }
});
