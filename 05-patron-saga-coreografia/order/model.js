const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  itemCount: { type: Number, required: true },

  transaction: { type: String, required: true },

  status: { type: String, required: true },
});

module.exports = mongoose.model('Order', schema);
