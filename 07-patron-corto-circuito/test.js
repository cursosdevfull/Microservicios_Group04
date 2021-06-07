const CircuitBreaker = require('./CircuitBreaker');

const request = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.6) {
      resolve({ data: 'Success' });
    } else {
      reject({ data: 'Failure' });
    }
  });
};

const options = {
  failureThreshold: 4,
  successThreshold: 2,
  timeout: 5000,
};

const circuitBreaker = new CircuitBreaker(request, options);

setInterval(() => {
  circuitBreaker.trigger().then(console.log).catch(console.error);
}, 1000);
