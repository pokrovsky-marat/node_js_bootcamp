const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./models/tourModel");
const fs = require("fs");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const exportAllToursFromJson = () => {
  const tours = JSON.parse(
    fs.readFileSync("./dev-data/data/tours.json", "utf-8")
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB is connected...");
      Tour.create(tours)
        .then((data) => {
          console.log(data);
          mongoose.connection.close();
        })
        .catch((error) => {
          console.log(error);
          mongoose.connection.close();
        });
    });
};

const deleteAllTours = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB is connected...");
      Tour.deleteMany({})
        .then(() => {
          console.log("We removed everything");
          mongoose.connection.close();
        })
        .catch((error) => console.log(error));
    });
};
if (process.argv[2] === "--import") {
  exportAllToursFromJson();
} else if (process.argv[2] === "--delete") {
  deleteAllTours();
}
