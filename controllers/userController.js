const AppError = require("./../utils/AppError");
const User = require("./../models/userModel");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const factory = require("./handlerFactory");

exports.updateMe = cathAsyncErrors(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This is not for password updates", 400));
  }
  //We use .findByIdAndUpdate() instead .save(), because of validators for password required field
  //It's not secure because user can add 'role:admin' to 'req.body',
  //and also we need to require password before changing users information
  let user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = cathAsyncErrors(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: "error", message: "This route has not yet defined" });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
