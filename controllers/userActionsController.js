const Address = require('../models/addressModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Function to add a new address for a user
exports.addAddress = catchAsync(async (req, res, next) => {
  const { country, state, localGov, zipCode, street } = req.body;
  const userId = req.user._id;

  if (!country) {
    return next(new AppError('country cannot be empty', 400));
  }
  if (!state) {
    return next(new AppError('state cannot be empty', 400));
  }
  if (!localGov) {
    return next(new AppError('local government cannot be empty', 400));
  }
  if (!zipCode) {
    return next(new AppError('zip code cannot be empty', 400));
  }

  if (!street) {
    return next(new AppError('street cannot be empty', 400));
  }

  // Create a new address document
  const newAddress = new Address({
    user: userId,
    country: country,
    state: state,
    localGov: localGov,
    zipCode: zipCode,
    street: street
  });

  // Save the new address to the database
  await newAddress.save();

  res.status(201).json({
    status: 'success',
    data: newAddress
  });
});

// Function to update an existing address
exports.updateAddress = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { addressId, country, state, localGov, zipCode, street } = req.body;

  // Find the address in the database
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { country, state, localGov, zipCode, street },
    { new: true, runValidators: true }
  );

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: address
  });
});

exports.getUserAddresses = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const userAddresses = await Address.find({ user: userId });

  res.status(200).json({
    status: 'success',
    data: userAddresses
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  const addressId = req.params.id;
  const userId = req.user._id;

  // Find the address in the database
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    return next(new AppError('Address not found or unauthorized', 404));
  }

  // Delete the address
  await address.remove();

  res.status(204).json({
    status: 'success',
    data: null
  });
});
