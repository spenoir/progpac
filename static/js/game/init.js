Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
}

Function.method('debug', function (toprint) {
  (console.log || function (whatever) {})(toprint);
});
