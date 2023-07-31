const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: String,
    ref: 'Product'
  },
  quantity: {
    type: String,
    default: 1
  },
  totalPrice: {
    type: String,
    required: true
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
