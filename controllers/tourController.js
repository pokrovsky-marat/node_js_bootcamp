const AppError = require("../utils/AppError");
const Tour = require("./../models/tourModel");

const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const factory = require("./handlerFactory");

exports.topCheapTours = (req, res, next) => {
  req.query = { sort: "price", limit: "5" };
  next();
};

exports.getTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {
  path: "reviews",
});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

//  '/tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = cathAsyncErrors(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(new AppError("Provide correct request data", 404));
  }

  console.log(lat, lng, distance, unit, radius);
  // {startLocation: {$geoWithin: { $centerSphere: [ [ -118.82162487907975, 34.02015811346436 ], 0.021642242501607737 ]}},$or: []}
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { data: tours },
  });
});
