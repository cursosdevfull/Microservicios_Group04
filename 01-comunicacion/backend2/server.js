const http = require('http');
const app = require('./app');

const port = process.env.PORT || 19020;

const server = http.createServer(app);
server
  .listen(port)
  .on('listening', () =>
    console.log('Backend2 Server is running on port: ' + port)
  )
  .on('error', (error) => console.log(error));
