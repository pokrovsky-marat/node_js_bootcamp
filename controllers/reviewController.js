const Review = require("../models/reviewModel");
const cathAsyncErrors = require("../utils/cathAsyncErrors");
const AppError = require("../utils/AppError");
const factory = require("./handlerFactory");


exports.getReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.getReview = factory.getOne(Review);
exports.addUserAndTourToReqBody = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.createReview = factory.createOne(Review);
