const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  price: Number,
  imageUrl: String, // Per semplicità useremo URL, ma si può implementare upload file
});

module.exports = mongoose.model('Product', ProductSchema);