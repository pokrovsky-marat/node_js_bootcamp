const mongoose = require("mongoose");
// const User = require("./userModel");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      maxLength: [
        50,
        "A tour must have a name less or equal than 50 characters",
      ],
      minLength: [5, "A tour must have a name more or equal than 5 characters"],
    },
    secretTour: { type: Boolean, default: false },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "A ratingsAverage must be less or equal than 5 "],
      min: [1, "A ratingsAverage must be more or equal than 1"],
    },
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "You should choose from: <easy>, <medium> or <difficult>",
      },
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount <{VALUE}> must be low than price",
      },
    },
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //Embeded documents
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//Virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
//Document Middleware: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  // this.name = this.name.toLowerCase();
  next();
});
/* //Tour guides embedding
tourSchema.pre("save", async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
}); */
//Document Middleware: runs after .save() and .create()
tourSchema.post("save", function (doc, next) {
  // console.log(doc);
  next();
});
//Query Middleware
tourSchema.pre(/^find/, function (next) {
  console.log("Query Middleware--");
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
//Populate guides
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`------ Query takes ${Date.now() - this.start} ms.   `);
  next();
});
//Aggregation  Middleware
tourSchema.pre("aggregate", function (next) {
  console.log("---------------------------");
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});
const Tour = new mongoose.model("Tour", tourSchema);
module.exports = Tour;
