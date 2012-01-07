var ScoreCell = (function () {
  return function (opts) {
    var o = opts || {};
    this.drawables = o.drawables || [];
    this.score = o.score || 0;
    this.visited = false;
  };
})();


ScoreCell.method('visit', function () {
  this.visited = true;
  return this.score;
});


ScoreCell.method('draw', function (ctx, r, c, x, y, w, h) {
  if (! this.visited) {
    for (var i = 0; i < this.drawables.length; i += 1)
      this.drawables[i].draw(ctx, r, c, x, y, w, h);
  }
});