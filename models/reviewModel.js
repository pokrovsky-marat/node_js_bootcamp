const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    // path: "tour user",
    path: "user", //To avoid nesting when populating tour>reviews, don't populate <tour>
    // select: "-__v",
    select: " name email ",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourID) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        // _id: "$tour", For this case doesn't matter null or "$tour"
        _id: null,
        numReviews: { $sum: 1 },
        ratingsAverage: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0].ratingsAverage,
      ratingsQuantity: stats[0].numReviews,
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post("save", function () {
  //this.constructor === Review
  this.constructor.calcAverageRatings(this.tour);
});
//To implement .calcAverageRatings() for delete and update reviews
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //to get document and save it to .currentReview property
  this.currentReview = await this.findOne();
  console.log(this.currentReview);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  if (!this.currentReview) {
    return;
  }
  await this.currentReview.constructor.calcAverageRatings(
    this.currentReview.tour
  );
});
const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
