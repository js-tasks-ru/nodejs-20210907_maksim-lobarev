const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('No such file');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {
        flags: 'wx'
      });

      const limitSizeStream = new LimitSizeStream({limit: 10000});

      req.pipe(limitSizeStream).pipe(writeStream);

      limitSizeStream.on('error', error => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(error.message);
        }
        else {
          res.statusCode = 500;
          res.end('Server error');
        }

        writeStream.destroy();
        fs.unlink(filepath, () => {});
      });

      writeStream.on('error', error => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exists');
        }
        else {
          res.statusCode = 500;
          res.end('Server error');
        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File created')
      });

      req.on('aborted', () => {
        limitSizeStream.destroy();
        writeStream.destroy();

        fs.unlink(filepath, () => {});
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
