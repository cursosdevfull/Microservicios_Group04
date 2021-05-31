const BrokerBootstrap = require('./broker.bootstrap');
const model = require('../model');

class TaskBootstrap {
  async consumer(channel, message, isError) {
    const messageAsJSON = JSON.parse(message.content.toString());
    const status = isError ? 'CANCELLED' : 'APPROVED';

    await model.findOneAndUpdate(
      { transaction: messageAsJSON.transaction },
      { status }
    );

    channel.ack(message);
  }

  async receiveMessage() {
    await BrokerBootstrap.receiveMessage(this.consumer.bind(this));
  }
}

module.exports = TaskBootstrap;
