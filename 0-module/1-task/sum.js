const _ = require('lodash');

const sum = (a, b) => {
  if (!_.isNumber(a) || !_.isNumber(b)) throw new TypeError();
  return a + b;
};

module.exports = sum;
