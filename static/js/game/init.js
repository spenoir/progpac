Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
}

Object.method('debug', function (toprint) {
  (console.log || function (whatever) {})(toprint);
});
