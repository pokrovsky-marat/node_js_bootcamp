const express = require("express");
const morgan = require("morgan");
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')

const app = express();

//1) Middleware
app.use(morgan("dev"))
app.use(express.json());

/*app.use((req, res, next) => {
    console.log("Hello from middleware!!!");
    next();
});*/
app.use((req, res, next) => {
    req.requestedTime = new Date();
    next();
});


//3) Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);


module.exports = app;
