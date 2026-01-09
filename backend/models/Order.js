const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);