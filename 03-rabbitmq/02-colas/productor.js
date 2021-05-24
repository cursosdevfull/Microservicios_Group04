const amqp = require('amqplib');
const args = process.argv.slice(2);

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchangeName = 'pubsub';
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });

  /*   const nameQueue = 'queue fanout';
  await channel.assertQueue(nameQueue, { durable: true }); */

  const message = args.length > 0 ? args[0] : 'message 01';
  channel.publish(exchangeName, '', Buffer.from(message));
  console.log(`Mensaje enviado: ${message}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
