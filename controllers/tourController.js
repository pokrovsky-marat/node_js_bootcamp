const fs = require("fs");
const tours = JSON.parse(
  fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);

const checkId = (req, res, next, val) => {
  console.log(`checkId middleware has completed, id value is ${val} `);
  if (val >= tours.length) {
    return res.status(404).json({ status: "fail", message: "Invalid ID" });
  }
  next();
};
const checkBodyTour = (req, res, next) => {
  if (!(req.body.name && req.body.price)) {
    return res.status(400).json({
      status: "fail",
      message: "Request body has to have price and name properties",
    });
  }
  next();
};

const getTours = (req, res) => {
  console.log(__dirname);

  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
};
const getTour = (req, res) => {
  let tour = tours.find((el) => {
    return el.id == req.params.id; //id is a string === is not equal
  });
  console.log(tour);
  res
    .status(200)
    .json({ status: "success", time: req.requestedTime, data: { tour } });
};

const createTour = (req, res) => {
  console.log(req.method);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  res.json({
    status: "success",
    message: "Ok",
  });
};
const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: {
      message: "Ok ",
    },
  });
};
module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBodyTour,
};
