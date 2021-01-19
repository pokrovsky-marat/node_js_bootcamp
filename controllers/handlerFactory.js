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
