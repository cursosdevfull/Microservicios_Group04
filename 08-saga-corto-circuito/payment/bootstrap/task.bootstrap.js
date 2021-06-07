const BrokerBootstrap = require('./broker.bootstrap');
const model = require('../model');
const CircuitBreaker = require('../helper/CircuitBreaker');

class TaskBootstrap {
  constructor() {
    const request = () => {
      return new Promise((resolve, reject) => {
        if (Math.random() > 0.6) {
          resolve({ data: 'Success' });
        } else {
          reject({ data: 'Failure' });
        }
      });
    };

    const options = {
      failureThreshold: 4,
      successThreshold: 2,
      timeout: 5000,
    };

    this.circuitBreaker = new CircuitBreaker(request, options);
  }

  async consumer(channel, message, isError) {
    const messageAsJSON = JSON.parse(message.content.toString());
    const status = isError ? 'CANCELLED' : 'APPROVED';

    if (isError) {
      await model.findOneAndUpdate(
        { transaction: messageAsJSON.payload.transaction },
        { status }
      );
    } else {
      this.circuitBreaker
        .trigger()
        .then(async (response) => {
          console.log(response);
          const { name, itemCount, transaction } = messageAsJSON.payload;
          const result = await model.create({
            name,
            itemCount,
            transaction,
            status,
          });
          const messageToSent = {
            type: 'BILLED_ORDER',
            payload: result,
          };
          await BrokerBootstrap.sendMessage('ORCHESTATOR_EVENT', messageToSent);
        })
        .catch(async (error) => {
          console.log(error);
          await BrokerBootstrap.sendMessage('ORCHESTATOR_EVENT', {
            type: 'PAYMENT_ERROR',
            payload: messageAsJSON.payload,
          });
        });

      // await BrokerBootstrap.sendMessage('ORCHESTATOR_EVENT', messageToSent);
    }

    channel.ack(message);
  }

  async receiveMessage() {
    await BrokerBootstrap.receiveMessage(this.consumer.bind(this));
  }
}

module.exports = TaskBootstrap;
