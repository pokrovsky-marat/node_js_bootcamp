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
  const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  err.statusCode = 404;
  err.status = "fail";
  next(err); //Pass "err" to the next middlware function
});

//Global Error Handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 404;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
