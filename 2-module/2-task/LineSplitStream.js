const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #lastPeace = ''
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let lines = chunk.toString().split(os.EOL)

    const ll = lines.length

    if (this.#lastPeace) {
      lines[0] = this.#lastPeace + lines[0]
      this.#lastPeace = ''
    }

    if (lines[ll-1] !== '') {
      this.#lastPeace = lines[ll-1]
      lines = lines.slice(0,-1)
    }

    for (let i = 0; i < ll; i++) {
      const line = lines[i];
      this.push(line);
    }
    callback(null)
  }

  _flush(callback) {
    if(this.#lastPeace) this.push(this.#lastPeace);
    callback(null)
  }
}

module.exports = LineSplitStream;
