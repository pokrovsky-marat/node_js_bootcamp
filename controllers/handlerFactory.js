const { Model } = require("mongoose");
const AppError = require("../utils/AppError");
const cathAsyncErrors = require("./../utils/cathAsyncErrors");

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
