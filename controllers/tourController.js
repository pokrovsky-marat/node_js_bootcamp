const Tour = require("./../models/tourModel");
const ApiFeatures = require("./../utils/ApiFeatures");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");

exports.topCheapTours = (req, res, next) => {
  req.query = { sort: "price", limit: "5" };
  next();
};

exports.getTours = cathAsyncErrors(async (req, res) => {
  let features = new ApiFeatures(Tour.find(), req.query);
  features.filter().sort().select().paginate();
  let tours = await features.query;
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

exports.getTour = cathAsyncErrors(async (req, res) => {
  let tour = await Tour.findById(req.params.id);
  res.status(200).json({ status: "success", data: { tour } });
});

exports.createTour = cathAsyncErrors(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: { tour: newTour },
  });
});

exports.updateTour = cathAsyncErrors(async (req, res) => {
  let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: { tour } });
});

exports.deleteTour = cathAsyncErrors(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
});

exports.getTourStats = cathAsyncErrors(async (req, res) => {
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

exports.getMonthlyPlan = cathAsyncErrors(async (req, res) => {
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
