const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");
const AppError = require("./utils/AppError");
const globalErrorController = require("./controllers/globalErrorController");
const rateLimit = require("express-rate-limit");
const app = express();

//1)Global Middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);
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
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404)); //Pass "err" to the next middlware function
});

//Global Error Handling
app.use(globalErrorController);
module.exports = app;
