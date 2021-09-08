function sum(a, b) {
  Array.prototype.forEach.call(arguments, (el) => {
    if (typeof el !== 'number') throw new TypeError();
  });

  return a + b;
}

module.exports = sum;
