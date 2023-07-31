const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  name: {
    type: String,
    require: true
  },
  number: {
    type: String,
    require: true
  },
  cvv: {
    type: String,
    require: true
  },
  expiration: {
    type: String,
    require: true
  }
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
