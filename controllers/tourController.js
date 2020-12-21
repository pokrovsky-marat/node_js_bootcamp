const Tour = require("./../models/tourModel");
const ApiFeatures = require("./../utils/ApiFeatures");

exports.topCheapTours = (req, res, next) => {
  req.query = { sort: "price", limit: "5" };
  next();
};

exports.getTours = async (req, res) => {
  try {
    let features = new ApiFeatures(Tour.find(), req.query);
    features.filter().sort().select().paginate();
    let tours = await features.query;
    res
      .status(200)
      .json({ status: "success", results: tours.length, data: { tours } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Not Found",
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err,
    });
  }
};
