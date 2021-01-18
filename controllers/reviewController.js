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
  let review = await Review.findById(req.params.id).populate({
    path: "tour user",
    select: "-__v",
  });
  if (!review) {
    return next(
      new AppError(`No review found with such ID <${req.params.id}>`, 404)
    );
  }
  res.status(200).json({ status: "success", data: { review } });
});
