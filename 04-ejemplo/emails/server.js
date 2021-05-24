const amqp = require('amqplib');

(async () => {
  const consumer = (message) => {
    console.log(` Email enviado ${message.content.toString()}`);
    setTimeout(() => {
      channel.ack(message);
    }, 3000);
  };

  const connection = await amqp.connect('amqp://RABBITMQ');
  const channel = await connection.createChannel();

  const exchangeName = 'exchange_fanout';
  await channel.assertExchange(exchangeName, 'fanout', { durable: true });
  channel.prefetch(1);

  const assertQueue = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(assertQueue.queue, exchangeName);

  console.log('Esperando un mensaje...');

  channel.consume(assertQueue.queue, consumer, { noAck: false });
})();
