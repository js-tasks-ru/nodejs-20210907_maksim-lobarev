const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end('No such file');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const readStream = fs.createReadStream(filepath);

      readStream.on('error', err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('No such file');
        }
        else {
          res.statusCode = 500;
          res.end('Server Error');
        }
      });

      req.on('aborted', () => {
        readStream.destroy();
      });

      readStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
