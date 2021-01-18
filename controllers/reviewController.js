const Review = require("../models/reviewModel");
const cathAsyncErrors = require("../utils/cathAsyncErrors");
const AppError = require("../utils/AppError");

exports.createReview = cathAsyncErrors(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: { review: newReview },
  });
});
//getReview
exports.getReview = cathAsyncErrors(async (req, res, next) => {
  let review = await Review.findById(req.params.id)
  if (!review) {
    return next(
      new AppError(`No review found with such ID <${req.params.id}>`, 404)
    );
  }
  res.status(200).json({ status: "success", data: { review } });
});
exports.getReviews = cathAsyncErrors(async (req, res, next) => {
  let reviews = await Review.find();
  if (!reviews) {
    return next(new AppError(`No reviews found `, 404));
  }
  res
    .status(200)
    .json({ status: "success", results: reviews.length, data: { reviews } });
});
