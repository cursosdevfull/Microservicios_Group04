const ServerBootstrap = require('./bootstrap/server.bootstrap');
const BrokerBootstrap = require('./bootstrap/broker.bootstrap');
const TaskBootstrap = require('./bootstrap/task.bootstrap');
const app = require('./app');

(async () => {
  const serverBootstrap = new ServerBootstrap(app);
  const brokerBootstrap = new BrokerBootstrap();
  const taskBootstrap = new TaskBootstrap();

  try {
    await serverBootstrap.initialize();
    await brokerBootstrap.initialize();
    await taskBootstrap.receiveMessage();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
