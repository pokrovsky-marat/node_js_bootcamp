const mongoose = require("mongoose");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
    },
    ratingsAverage: { type: Number, default: 4.5 },
    price: { type: Number, required: [true, "A tour must have a price"] },
    duration: { type: Number, required: [true, "A tour must have a duration"] },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a maxGroupSize"],
    },
    difficulty: {
      type: String,
      trim: true,
      required: [true, "A tour must have a difficulty"],
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: { type: Number },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "A tour must have a imageCover"],
    },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//Virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//Document Middleware: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  next();
});
tourSchema.pre("save", function (next) {
  console.log("This is document middleware");
  next();
});
//Document Middleware: runs after .save() and .create()
tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
