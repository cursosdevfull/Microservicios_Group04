const amqp = require('amqplib');
let channel;

class BrokerBootstrap {
  async initialize() {
    const host = process.env.RABBIT_HOST || 'localhost:5672';

    const connection = await amqp.connect(`amqp://${host}`);
    channel = await connection.createChannel();

    console.log('Connection to Rabbitmq successfully established');
  }

  static async sendMessage(queueName, message) {
    const messageAsString = JSON.stringify(message);
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(messageAsString));
  }

  static async receiveMessage(consumer) {
    const queueName = 'ORDER_PREPARE_EVENT';
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (message) => consumer(channel, message, false), {
      noAck: false,
    });
  }
}

module.exports = BrokerBootstrap;
