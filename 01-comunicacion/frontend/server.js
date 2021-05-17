const http = require('http');
const app = require('./app');

const port = process.env.PORT || 19000;

const server = http.createServer(app);
server
  .listen(port)
  .on('listening', () =>
    console.log('Frontend Server is running on port: ' + port)
  )
  .on('error', (error) => console.log(error));
