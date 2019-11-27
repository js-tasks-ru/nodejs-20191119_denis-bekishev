const stream = require('stream');
const _ = require('lodash');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #size = 0
  #limit = Infinity

  constructor(options) {
    super(options)
    const {limit} = options || {}
    if (limit && _.isNumber(limit)) this.#limit = limit
  }

  _transform(chunk, encoding, callback) {
    this.#size += chunk.byteLength
    if (this.#size > this.#limit) {
      callback(new LimitExceededError())
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;
