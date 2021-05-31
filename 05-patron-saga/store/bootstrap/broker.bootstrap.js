const amqp = require('amqplib');
let channel;

class BrokerBootstrap {
  async initialize() {
    const host = process.env.RABBIT_HOST || 'localhost:5672';

    const connection = await amqp.connect(`amqp://${host}`);
    channel = await connection.createChannel();

    console.log('Connection to Rabbitmq successfully established');
  }

  static async sendMessage(message) {
    const messageAsString = JSON.stringify(message);
    const queueName = 'ORDER_PREPARE_EVENT';
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(messageAsString));
  }

  static async sendError(message) {
    const messageAsString = JSON.stringify(message);

    const exchangeName = 'FAILED_ERROR_EXCHANGE';
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    channel.publish(
      exchangeName,
      'store.order_cancelled.error',
      Buffer.from(messageAsString)
    );
  }

  static async receiveMessage(consumer) {
    const queueName = 'BILLED_ORDER_EVENT';
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (message) => consumer(channel, message, false), {
      noAck: false,
    });

    const exchangeName = 'FAILED_ERROR_EXCHANGE';
    await channel.assertExchange(exchangeName, 'topic', { durable: true });

    const routingKeys = ['delivery.order_cancelled.error'];
    const assertQueue = await channel.assertQueue('', { exclusive: true });

    for (const key of routingKeys) {
      channel.bindQueue(assertQueue.queue, exchangeName, key);
    }

    channel.consume(
      assertQueue.queue,
      (message) => consumer(channel, message, true),
      {
        noAck: false,
      }
    );
  }
}

module.exports = BrokerBootstrap;
