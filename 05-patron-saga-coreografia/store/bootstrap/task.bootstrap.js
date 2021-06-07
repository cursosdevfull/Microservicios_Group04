const BrokerBootstrap = require('./broker.bootstrap');
const model = require('../model');

class TaskBootstrap {
  async consumer(channel, message, isError) {
    const messageAsJSON = JSON.parse(message.content.toString());
    const status = isError ? 'CANCELLED' : 'APPROVED';

    if (isError) {
      await model.findOneAndUpdate(
        { transaction: messageAsJSON.transaction },
        { status }
      );
    } else {
      const { name, itemCount, transaction } = messageAsJSON;
      const result = await model.create({
        name,
        itemCount,
        transaction,
        status,
      });

      await BrokerBootstrap.sendMessage(result);
    }

    channel.ack(message);
  }

  async receiveMessage() {
    await BrokerBootstrap.receiveMessage(this.consumer.bind(this));
  }
}

module.exports = TaskBootstrap;
