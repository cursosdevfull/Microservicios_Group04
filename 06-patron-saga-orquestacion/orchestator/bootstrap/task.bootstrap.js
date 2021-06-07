const BrokerBootstrap = require('./broker.bootstrap');

class TaskBootstrap {
  async consumer(channel, message) {
    const messageAsJSON = JSON.parse(message.content.toString());

    let newMessage;

    switch (messageAsJSON.type) {
      case 'ORDER_CREATED':
        newMessage = {
          type: 'ORDER_CREATED',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessage('ORDER_CREATE_EVENT', newMessage);
        break;
      case 'BILLED_ORDER':
        newMessage = {
          type: 'BILLED_ORDER',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessage('BILLED_ORDER_EVENT', newMessage);
        break;
      case 'ORDER_PREPARE':
        newMessage = {
          type: 'ORDER_PREPARE',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessage('ORDER_PREPARE_EVENT', newMessage);
        break;
      case 'ORDER_DELIVERIED':
        newMessage = {
          type: 'ORDER_DELIVERIED',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessage('ORDER_DELIVERIED_EVENT', newMessage);
        break;
      case 'PAYMENT_ERROR':
        newMessage = {
          type: '',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessageError(
          'payment.order_cancelled.error',
          newMessage
        );
        break;
      case 'STORE_ERROR':
        newMessage = {
          type: '',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessageError(
          'store.order_cancelled.error',
          newMessage
        );
        break;
      case 'DELIVERY_ERROR':
        newMessage = {
          type: '',
          payload: messageAsJSON.payload,
        };
        BrokerBootstrap.sendMessageError(
          'delivery.order_cancelled.error',
          newMessage
        );
        break;
    }

    channel.ack(message);
  }

  async receiveMessage() {
    await BrokerBootstrap.receiveMessage(this.consumer.bind(this));
  }
}

module.exports = TaskBootstrap;
