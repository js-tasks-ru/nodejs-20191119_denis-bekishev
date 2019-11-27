/**
 * Created by Denis Bekishev on 27.11.2019.
 */

const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(line) {
  console.log('!!' + line);
}

lines.on('data', onData);

lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья `);
lines.write(`строка${os.EOL}четвертая строка${os.EOL}пятая строка${os.EOL}шестая строка`);
lines.write(`${os.EOL}7 строка${os.EOL}8 строка${os.EOL}9 строка`);
lines.write(`10 строка${os.EOL}11 строка${os.EOL}12 строка${os.EOL}`);
lines.write(`13 строка`);

lines.end();
