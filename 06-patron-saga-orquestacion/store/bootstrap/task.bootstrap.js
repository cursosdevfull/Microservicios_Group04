const BrokerBootstrap = require('./broker.bootstrap');
const model = require('../model');

class TaskBootstrap {
  async consumer(channel, message, isError) {
    const messageAsJSON = JSON.parse(message.content.toString());
    const status = isError ? 'CANCELLED' : 'APPROVED';

    if (isError) {
      await model.findOneAndUpdate(
        { transaction: messageAsJSON.payload.transaction },
        { status }
      );
    } else {
      const { name, itemCount, transaction } = messageAsJSON.payload;
      const result = await model.create({
        name,
        itemCount,
        transaction,
        status,
      });

      const messageToSent = {
        type: 'ORDER_PREPARE',
        payload: result,
      };

      await BrokerBootstrap.sendMessage('ORCHESTATOR_EVENT', messageToSent);
    }

    channel.ack(message);
  }

  async receiveMessage() {
    await BrokerBootstrap.receiveMessage(this.consumer.bind(this));
  }
}

module.exports = TaskBootstrap;
