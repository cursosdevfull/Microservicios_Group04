const http = require('http');

class ServerBootstrap {
  constructor(app) {
    this.app = app;
  }

  initialize() {
    const promise = new Promise((resolve, reject) => {
      const port = process.env.PORT || 3030;

      const server = http.createServer(this.app);
      server
        .listen(port)
        .on('listening', () => {
          resolve(true);
          console.log(`Server is running on port ${port}`);
        })
        .on('error', (err) => {
          reject(err);
          console.log(err);
        });
    });

    return promise;
  }
}

module.exports = ServerBootstrap;
