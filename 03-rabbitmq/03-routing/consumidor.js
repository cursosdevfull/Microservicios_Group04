const amqp = require('amqplib');
const args = process.argv.slice(2);

(async () => {
  const consumer = (message) => {
    console.log(` Recibido ${message.content.toString()}`);
    setTimeout(() => {
      channel.ack(message);
    }, 3000);
  };

  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'exchange_direct';
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  channel.prefetch(1);

  const assertQueue = await channel.assertQueue('', { exclusive: false });

  const routing = args.length > 0 ? args[0] : 'error';

  await channel.bindQueue(assertQueue.queue, exchangeName, routing);

  console.log('Esperando un mensaje...');

  channel.consume(assertQueue.queue, consumer, { noAck: false });
})();
