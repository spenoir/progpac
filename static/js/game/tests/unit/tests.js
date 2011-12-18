$(function () {
  module("game");

  var drawerWasInvoked = 0;
  var customDrawer = function (ctx, x, y) {
    drawerWasInvoked += 1;
  }

  var pac = new Pac({
    row : 10,
    col : 10,
    drawer: customDrawer
  });

  var grid = new Grid({
    rows: 20,
    cols: 20
  });

  test("pac should return drawer only for current position", function () {
    equal(pac.cellDrawerGetter.get(5, 5), undefined, 'there shouldn\'t be drawer in cell [5, 5]');
    equal(pac.cellDrawerGetter.get(10, 10), pac.drawer, 'there shouldn be drawer in cell [10, 10]');
  });

  test("grid should choose drawer getter if it is given", function () {
    var result = grid.chooseCellDrawerGetter(pac.cellDrawerGetter);
    equal(result, pac.cellDrawerGetter, "grid is choosing wrong drawer getter");

    var result = grid.chooseCellDrawerGetter();
    equal(result, grid.cellDrawerGetter, "grid should choose default drawer getter if it's not given");
  });

  test("grid should choose drawer if it is given", function () {
    var result = grid.chooseCellDrawer(pac.drawer);
    equal(result, pac.drawer, "grid is choosing wrong drawer");

    var result = grid.chooseCellDrawer();
    equal(result, grid.cellDrawer, "grid should choose default drawer if it's not given");
  });

  test("grid should invoke drawer only once", function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    grid.redraw(ctx, pac.cellDrawerGetter);
    equal(drawerWasInvoked, 1, "Drawer should to be invoke exacly one time.")
  });
});
