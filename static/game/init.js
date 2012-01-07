Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
}

Object.method('debug', function (toprint) {
  if (console !== undefined && console.log !== undefined)
    console.log(toprint);
});
