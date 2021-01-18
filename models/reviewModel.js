const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must have a content"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      max: [5, "A rating must be less or equal than 5 "],
      min: [1, "A rating must be more or equal than 1"],
    },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must have a tour"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must have an author"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
