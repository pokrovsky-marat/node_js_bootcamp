const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");

const app = express();

//1) Middleware

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./public/"));

app.use((req, res, next) => {
  req.requestedTime = new Date();
  next();
});

//3) Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
//4)Handling With Unhandled Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server.`,
  });
});
module.exports = app;
