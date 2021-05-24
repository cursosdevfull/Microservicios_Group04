const amqp = require('amqplib');
const args = process.argv.slice(2);

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'exchange_topic';
  await channel.assertExchange(exchangeName, 'topic', { durable: true });

  const routing = args.length > 0 ? args[0] : 'general.error';
  const message = args.length > 0 ? args[1] : 'message 01';

  channel.publish(exchangeName, routing, Buffer.from(message));
  console.log(`Mensaje enviado: ${message}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
