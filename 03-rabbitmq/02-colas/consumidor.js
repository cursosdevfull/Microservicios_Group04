const amqp = require('amqplib');

(async () => {
  const consumer = (message) => {
    console.log(` Recibido ${message.content.toString()}`);
  };

  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'pubsub';
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });

  const assertQueue = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(assertQueue.queue, exchangeName, '');

  console.log('Esperando un mensaje...');

  channel.consume(assertQueue.queue, consumer, { noAck: true });
})();
