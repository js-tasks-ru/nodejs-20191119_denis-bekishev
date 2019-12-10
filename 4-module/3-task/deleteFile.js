const fs = require('fs');

module.exports = function receiveFile(filepath, req, res) {
  fs.unlink(filepath, (err, data) => {

    if (err && err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File not found!');
      return;
    } else if (err) {
      res.statusCode = 500;
      res.end('Error!');
      return;
    }
    res.statusCode = 200;
    res.end('File deleted');
  });
};
