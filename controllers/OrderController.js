const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Card = require('../models/CardModel');
const Address = require('../models/addressModel');

exports.createOrder = catchAsync(async (req, res, next) => {
  //get the cart id
  const cartId = req.body.cartId;
  const user = req.user;
  // validate the cart id
  if (!cartId) {
    return next(new AppError('Please provide a cartId', 400));
  }

  //check if the cart exists
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  // get user address and card
  const card = await Card.findOne({ user: user._id });
  const address = await Address.findOne({ user: user._id });

  //create a new order
  const order = await Order.create({
    cartId,
    userId: user._id
  });

  // update the cart
  await Cart.findByIdAndUpdate(cartId, { paid: true });

  // return the new order
  res.status(201).json({
    status: 'success',
    data: {
      order,
      card,
      address
    }
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  //get the user
  const user = req.user;

  // get the user orders with status paid to true
  const orders = await Order.find({ userId: user });

  //map the orders into one array
  const ordersArray = orders.map(order => order.toObject());

  //return the orders
  res.status(200).json({
    status: 'success',
    data: ordersArray
  });
});