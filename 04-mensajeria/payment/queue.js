const amqp = require('amqplib');

const sendMessage = async (message) => {
  const connection = await amqp.connect('amqp://RABBITMQ');
  const channel = await connection.createChannel();

  const exchangeName = 'exchange_fanout';
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });

  channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

module.exports = sendMessage;
