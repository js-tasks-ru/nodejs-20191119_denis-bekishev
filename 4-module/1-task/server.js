const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');
const server = new http.Server();

const statAsync = util.promisify(fs.stat);


server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  console.log('---filepath ', filepath);

  switch (req.method) {
    case 'GET':
      if (!~pathname.indexOf('/')) {
        try {
          const a = await statAsync(filepath);
          if (!a.isFile()) {
            res.statusCode = 500;
            res.end('Not is file');
            return;
          }
          res.statusCode = 200;
          const fileStream = fs.createReadStream(filepath);
          /* async iterator */
          fileStream.once('close', () => {
            res.statusCode = 200;
            res.end();
          });

          for await (const chunk of fileStream) {
            res.write(chunk);
          }

        } catch (e) {
          if (e.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not Found');
            return;
          }
          res.statusCode = 500;
          res.end(e.message);
          return;
        }
      } else {
        res.statusCode = 400;
        res.end('Can\'t be hierarchy');
        return;
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
