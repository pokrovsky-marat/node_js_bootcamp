//In order to make this script work,
//you have to temporarily comment pre save middlware from user module

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./models/tourModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");
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
  const users = JSON.parse(
    fs.readFileSync("./dev-data/data/users.json", "utf-8")
  );
  const reviews = JSON.parse(
    fs.readFileSync("./dev-data/data/reviews.json", "utf-8")
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
    });
  Tour.create(tours)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  User.create(users, { validateBeforeSave: false })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  Review.create(reviews)
    .then((data) => {
      console.log(data);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close();
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
    });
  Tour.deleteMany({})
    .then(() => {
      console.log("We removed everything");
    })
    .catch((error) => console.log(error));
  User.deleteMany({})
    .then(() => {
      console.log("We removed everything");
    })
    .catch((error) => console.log(error));
  Review.deleteMany({})
    .then(() => {
      console.log("We removed everything");
      mongoose.connection.close();
    })
    .catch((error) => {
      mongoose.connection.close();
      console.log(error);
    });
};
if (process.argv[2] === "--import") {
  exportAllToursFromJson();
} else if (process.argv[2] === "--delete") {
  deleteAllTours();
}
