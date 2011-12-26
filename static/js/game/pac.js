var Pac = (function () {
  var defaults = {
    row: 0,
    col: 0,
  };

  var CycleList = (function (items) {
    var items = items;
    var currentIndex = 0;
    return {
      right: function () {
	currentIndex += 1;
	if (currentIndex === items.length)
	  currentIndex = 0;
	return items[currentIndex];
      },
      left: function () {
	currentIndex -= 1;
	if (currentIndex === -1)
	  currentIndex = items.length - 1;
	return items[currentIndex];
      },
      current: function () {
	return items[currentIndex];
      }
    };
  });

  return function (opts) {
    var o = opts || {};
    this.row = o.row || defaults.row;
    this.col = o.col || defaults.col;
    this.score = 0;
    this.direction = CycleList(["n", "e", "s", "w"]);
  }
})();


Pac.method('draw', function (ctx, r, c, x, y, w, h) {
  if (r === this.row && c === this.col)
    Drawing.pacmanDrawer.draw(ctx, r, c, x, y, w, h, this.direction.current());
});


Pac.method('move', function (what) {  // s(step) ; l(turn-left) ; l(turn-right)
  switch (what) {
  case "s": this.step(); break;
  case "r": this.direction.right(); break;
  case "l": this.direction.left(); break;
  case "@": success(); break;
  default:
    this.debug("Wrong move: " + what);
  }
});


Pac.method('step', function () {
  var direction = this.direction.current();
  switch (direction) {
  case "n": this.row--; break;
  case "s": this.row++; break;
  case "e": this.col++; break;
  case "w": this.col--; break;
  default:
    this.debug("Wrong direction: " + direction);
  }
});


// PacMan PastPosition
var PastPosition = (function () {
  return function (opts) {
    var o = opts || {};
    this.row = o.row;
    this.col = o.col;
    this.direction = o.direction;
  }
})();


PastPosition.method('draw', function (ctx, r, c, x, y, w, h) {
  if (r === this.row && c === this.col)
    Drawing.pacpathDrawer.draw(ctx, r, c, x, y, w, h, this.direction);
});
