/**
 * Created by Denis Bekishev on 27.11.2019.
 */
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');
const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink)

const limitedStream = new LimitSizeStream({limit: 1}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

try {
  limitedStream.pipe(outStream);

  limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

  setTimeout(() => {
    limitedStream.write('world1'); // ошибка LimitExceeded! в файле осталось только hello
  }, 10);
} catch (limitError) {
  if (limitError instanceof LimitExceededError) {
    unlinkAsync('out.txt');
    throw limitError;
  }
}

