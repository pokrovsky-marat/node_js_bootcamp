const AppError = require("../utils/AppError");
const Tour = require("./../models/tourModel");
const ApiFeatures = require("./../utils/ApiFeatures");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const factory = require("./handlerFactory");

exports.topCheapTours = (req, res, next) => {
  req.query = { sort: "price", limit: "5" };
  next();
};

exports.getTours = cathAsyncErrors(async (req, res, next) => {
  let features = new ApiFeatures(Tour.find(), req.query);
  features.filter().sort().select().paginate();
  let tours = await features.query;
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

exports.getTour = cathAsyncErrors(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id).populate({
    path: "reviews",
  });
  if (!tour) {
    return next(
      new AppError(`No tour found with such ID <${req.params.id}>`, 404)
    );
  }
  res.status(200).json({ status: "success", data: { tour } });
});

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
/* exports.deleteTour = cathAsyncErrors(async (req, res, next) => {
  let tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(
      new AppError(`No tour found with such ID <${req.params.id}>`, 404)
    );
  }
  res.status(204).json({
    status: "success",
  });
}); */

exports.getTourStats = cathAsyncErrors(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { avgPrice: -1 } }, //avgPrice это переменная полученная в пред. стадии
    // { $match: { _id: { $ne: "easy" } } },//Исключить из предыдущей выборки 'easy'
  ]);
  res.status(200).json({ status: "success", data: { stats } });
});

exports.getMonthlyPlan = cathAsyncErrors(async (req, res, next) => {
  const year = req.params.year;
  console.log(year);
  const stats = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(year),
          $lt: new Date(year * 1 + 1 + ""),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numTours: -1 } }, //avgPrice это переменная полученная в пред. стадии
    { $limit: 50 }, //Show only 50 documents
  ]);
  res.status(200).json({ status: "success", data: { stats } });
});
