const AppError = require("../utils/AppError");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");
const ApiFeatures = require("./../utils/ApiFeatures");

exports.deleteOne = (Model) =>
  cathAsyncErrors(async (req, res, next) => {
    let doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError(`No document found with such ID <${req.params.id}>`, 404)
      );
    }
    res.status(204).json({
      status: "success",
    });
  });
exports.updateOne = (Model) =>
  cathAsyncErrors(async (req, res, next) => {
    let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`No document found with such ID <${req.params.id}>`, 404)
      );
    }
    res.status(200).json({ status: "success", data: { doc } });
  });
exports.createOne = (Model) =>
  cathAsyncErrors(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: { data: doc },
    });
  });
exports.getOne = (Model, populateOptions) =>
  cathAsyncErrors(async (req, res, next) => {
    let doc;
    if (populateOptions) {
      doc = await Model.findById(req.params.id).populate(populateOptions);
    } else {
      doc = await Model.findById(req.params.id);
    }
    if (!doc) {
      return next(
        new AppError(`No document found with such ID <${req.params.id}>`, 404)
      );
    }
    res.status(200).json({ status: "success", data: { data: doc } });
  });

exports.getAll = (Model) =>
  cathAsyncErrors(async (req, res, next) => {
    ////Next two lines only for, Find reviews by Tour
    let options = {};    
    if (req.params.tourId) options = { tour: req.params.tourId };

    let features = new ApiFeatures(Model.find(options), req.query);
    features.filter().sort().select().paginate();
    let docs = await features.query;
    res
      .status(200)
      .json({ status: "success", results: docs.length, data: { data: docs } });
  });
