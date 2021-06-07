const mongoose = require('mongoose');

class DatabaseBootstrap {
  initialize() {
    const promise = new Promise((resolve, reject) => {
      const username = process.env.MONGO_USERNAME || 'root';
      const password = process.env.MONGO_PASSWORD || 'ElMund03sanch0';
      const host = process.env.MONGO_HOST || 'localhost';
      const port = process.env.MONGO_PORT || 27017;
      const database = process.env.MONGO_DATABASE || 'delivery';
      const authSource = process.env.MONGO_AUTHSOURCE || 'admin';

      const connectionString = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}&retryWrites=true&w=majority`;
      const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        poolSize: 10,
      };

      const callbackResponse = (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
          console.log('Connection to database successfully established');
        }
      };

      mongoose.connect(connectionString, options, callbackResponse);
    });

    return promise;
  }

  disconnect() {
    try {
      mongoose.disconnect();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DatabaseBootstrap;
