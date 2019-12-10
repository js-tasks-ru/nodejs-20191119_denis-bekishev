/**
 * Created by Denis Bekishev on 04.12.2019.
 */

const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');

const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');


const server = new http.Server();

server.on('clientError', async () => {
  const filepath = path.join(__dirname, 'files');
  await fse.remove(filepath);
  await fse.ensureDir(filepath);
});

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (~pathname.indexOf('/')) {
        res.statusCode = 400;
        res.end('Can\'t be hierarchy');
        return;
      }

      try {
        const a = await fse.stat(filepath);
        if (a.isFile()) {
          res.statusCode = 409;
          res.end('File already exists');
          return;
        }
      } catch (e) {
        if (e.code === 'ENOENT') {
          const limitedStream = new LimitSizeStream({limit: 1e6});
          const fileWriteStream = fse.createWriteStream(filepath);

          await new Promise((resolve) => {
            const limit = req.pipe(limitedStream);
            const ws = limit.pipe(fileWriteStream);

            limit.on('error', async (err) => {
              if (err instanceof LimitExceededError) {
                resolve({
                  error: true,
                  code: 413,
                  message: 'limit',
                });
                fileWriteStream.end();
              } else {
                resolve({
                  error: true,
                  code: 500,
                  message: err.message,
                });
                fileWriteStream.end();
              }
            });

            ws.on('error', async (err) => {
              resolve({
                error: true,
                code: 500,
                message: err.message,
              });
              fileWriteStream.end();
            });

            fileWriteStream.on('error', async (err) => {
              resolve({
                error: true,
                code: 500,
                message: err.message,
              });
            });

            fileWriteStream.once('close', () => {
              resolve({
                error: false,
                code: 201,
                message: 'OK',
              });
            });
          }).then(async ({error, code, message}) => {
            if (error) {
              await fse.remove(filepath);
            }
            console.log('---resp ', code)
            res.statusCode = code;
            res.end(message);
          }).catch((e) => {
            res.statusCode = 500;
            res.end(e.message);
          });
        } else {
          res.statusCode = 500;
          return res.end(error.message);
        }
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
