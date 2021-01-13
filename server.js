const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("Uncaught Exception! Shuting down...");
});
// console.log(x);//uncaughtException 'x' doesn't exist

dotenv.config({
  path: "./config.env",
});
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected..."));

// const testTour = new Tour({
//   name: "The Park Camper",

//   price: 497,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(`ERROR!!!   ${err}`);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
//If we have serious error, <no db connection> for example,
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shuting down...");
  server.close(() => {
    //We close server
    process.exit(1); //And kill programm
  });
});
