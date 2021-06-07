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
    /*     const exchangeName = 'ORCHESTATOR_EXCHANGE';
    await channel.assertExchange(exchangeName, 'direct', { durable: true }); */

    const queueName = 'ORDER_CREATE_EVENT';
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (message) => consumer(channel, message, false), {
      noAck: false,
    });

    const exchangeName = 'FAILED_ERROR_EXCHANGE';
    await channel.assertExchange(exchangeName, 'topic', { durable: true });

    const routingKeys = [
      'store.order_cancelled.error',
      'delivery.order_cancelled.error',
    ];
    const assertQueue = await channel.assertQueue('', { exclusive: true });

    for (const routingKey of routingKeys) {
      channel.bindQueue(assertQueue.queue, exchangeName, routingKey);
      //channel.unbindQueue(assertQueue.queue, exchangeName, routingKey);
    }
    channel.consume(
      assertQueue.queue,
      (message) => consumer(channel, message, true),
      { noAck: false }
    );
  }
}

module.exports = BrokerBootstrap;
