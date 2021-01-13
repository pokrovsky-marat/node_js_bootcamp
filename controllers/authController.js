const User = require("./../models/userModel");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");

exports.signup = cathAsyncErrors(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    body: {
      user: newUser,
    },
  });
});
