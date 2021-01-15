const util = require("util");
const User = require("./../models/userModel");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
const sendEmail = require("./../utils/sendEmail");

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
exports.protect = cathAsyncErrors(async (req, res, next) => {
  //1.)Check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You're not logged in, please log in and try again", 401)
    );
  }
  //2.)Verification token
  let decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3.)Check if user still exist
  let freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User with this token does not longer exist", 401)
    );
  }
  //4.)Check if user changed his password after token was signed
  if (freshUser.changedPassword(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  req.user = freshUser; //Pass to next middleware to check his roles
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Only leads and admins can delete tours", 403));
    }
    next();
  };
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
exports.forgotPassword = cathAsyncErrors(async (req, res, next) => {
  //1) Check if user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No users with that email", 404));
  }
  //2) Generate token and sent it to user
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3)Send email to user
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password
  and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.resetPassword = cathAsyncErrors(async (req, res, next) => {});
