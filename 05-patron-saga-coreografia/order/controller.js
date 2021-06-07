const BrokerBootstrap = require('./bootstrap/broker.bootstrap');

class Controller {
  constructor(model) {
    this.model = model;
  }

  async insert(req, res) {
    const { name, itemCount, transaction } = req.body;
    const document = { name, itemCount, transaction, status: 'PENDING' };
    const result = await this.model.create(document);

    await BrokerBootstrap.sendMessage(result);
    res.json(result);
  }
}

module.exports = Controller;
