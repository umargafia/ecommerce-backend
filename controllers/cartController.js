const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addToCart = catchAsync(async (req, res, next) => {
  // get the items and user
  const { quantity, product, totalPrice } = req.body;
  const userId = req.user._id;

  if (!quantity) {
    return next(new AppError('quantity cannot be empty', 400));
  }

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (!totalPrice) {
    return next(new AppError('Total price cannot be empty', 400));
  }

  // Check if the product is already in the user's cart
  const existingCartItem = await Cart.findOne({
    user: userId,
    product: product.id
  });

  if (existingCartItem) {
    //if the product is in the cart, update the cart
    existingCartItem.quantity = quantity;
    existingCartItem.totalPrice = totalPrice;
    await existingCartItem.save();
    return res.json(existingCartItem);
  } else {
    // If the product is not in the cart, create a new cart item
    const newCartItem = new Cart({
      user: userId,
      product: product.id,
      quantity: quantity,
      totalPrice: totalPrice
    });
    await newCartItem.save();
    return res.json(newCartItem);
  }
});

exports.removeFromFavorites = catchAsync(async (req, res, next) => {
  const { cartID } = req.body;
  const userId = req.user.id;

  // 1) Check if cartID exists
  if (!cartID) {
    return next(new AppError('Please provide a cartID', 400));
  }

  // 2) Check if the favorite recipe exists in user's favorites
  const existingFavorite = await Cart.findOne({
    recipe: cartID,
    user: userId
  });
  if (!existingFavorite) {
    return next(
      new AppError('This Item does not exist in your favorites', 400)
    );
  }

  // 3) Remove the recipe from user's favorites
  await Cart.findOneAndDelete({
    recipe: cartID,
    user: userId
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUserFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const favoriteRecipes = await Cart.find({ user: userId }).populate('recipe');

  res.status(200).json({
    status: 'success',
    data: {
      favorites: favoriteRecipes.map(favorite => favorite.recipe)
    }
  });
});
