const amqp = require('amqplib');
const args = process.argv.slice(2);

(async () => {
  const consumer = (message) => {
    console.log(` Routing: ${message.fields.routingKey}`);
    console.log(` Recibido ${message.content.toString()}`);
  };

  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'exchange_topic';
  await channel.assertExchange(exchangeName, 'topic', { durable: true });

  const assertQueue = await channel.assertQueue('', { exclusive: false });

  const keys = args.length > 0 ? args : ['general.error'];

  keys.forEach((key) => {
    channel.bindQueue(assertQueue.queue, exchangeName, key);
  });

  console.log('Esperando un mensaje...');

  channel.consume(assertQueue.queue, consumer, { noAck: true });
})();
