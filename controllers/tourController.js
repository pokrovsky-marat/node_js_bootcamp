const Tour = require("./../models/tourModel");

exports.getTours = async (req, res) => {
  try {
    console.log(req.query);
    // let tours = await Tour.find({
    //   duration: req.query.duration,
    //   difficulty: req.query.difficulty,
    // });

    // let tours = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");
    //1.)Filtering------------------------------------------------
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2.)Apply modificators--------------------------------------
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));
    //3.)Sorting------------------------------------------------
    if (req.query.sort) {
      let sortBy = JSON.parse(
        JSON.stringify(req.query.sort).replace(/,/g, " ")
      );

      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); //sorting by default
    }
    //4.)Selecting--------------------------------
    if (req.query.fields) {
      let fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // "-" Minus sign means exclude this field
    }
    //4.)Pagination--------------------------------
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error("This page does not exist");
    }

    let tours = await query;
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
