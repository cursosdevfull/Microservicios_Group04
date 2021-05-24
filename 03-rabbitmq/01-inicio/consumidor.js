const amqp = require('amqplib');

(async () => {
  const consumer = (message) => {
    console.log(` Recibido ${message.content.toString()}`);
  };

  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queueName = 'queue 01';
  await channel.assertQueue(queueName, { durable: false });

  console.log('Esperando un mensaje...');

  channel.consume(queueName, consumer, { noAck: false });
})();
