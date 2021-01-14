const User = require("./../models/userModel");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = cathAsyncErrors(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = makeToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = cathAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email&password exist
  if (!email || !password) {
    return next(new AppError("Please provide email & password", 400));
  }
  //Check if user exist && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect email & password", 401));
  }
  //Make Token
  const token = makeToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
