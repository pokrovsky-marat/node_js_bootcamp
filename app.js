const express = require("express");
const morgan = require("morgan");
const fs = require("fs");

const app = express();
const tours = JSON.parse(
    fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);

//1) Middleware
app.use(morgan("dev"))
app.use(express.json());

app.use((req, res, next) => {
    console.log("Hello from middleware!!!");
    next();
});
app.use((req, res, next) => {
    req.requestedTime = new Date();
    next();
});

//2) Route handlers
const getTours = (req, res) => {
    res
        .status(200)
        .json({status: "success", results: tours.length, data: {tours}});
}
const getTour = (req, res) => {
    let id = req.params.id;
    if (id > tours.length) {
        return res.status(404).json({status: "fail", message: "Invalid ID"});
    }
    let tour = tours.find((el) => {
        return el.id == id; //id is a string === is not equal
    });
    res.status(200).json({status: "success", time: req.requestedTime, data: {tour}});
}
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
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
}
const updateTour = (req, res) => {
    console.log(req.body)
    res.json({
        status: "success",
        message: 'Ok'
    })
}
const deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
        data: {
            message: "Ok ",
        },
    });
}

//2.2) Route handlers for users
const getAllUsers = (req, res) => {
    res
        .status(500)
        .json({status: "error", message: "This route has not yet defined"});
}
const getUser = (req, res) => {
    res
        .status(500)
        .json({status: "error", message: "This route has not yet defined"});
}
const createUser = (req, res) => {
    res
        .status(500)
        .json({status: "error", message: "This route has not yet defined"});
}
const updateUser = (req, res) => {
    res
        .status(500)
        .json({status: "error", message: "This route has not yet defined"});
}
const deleteUser = (req, res) => {
    res
        .status(500)
        .json({status: "error", message: "This route has not yet defined"});
}

//3) Routes

const userRouter = express.Router();
const tourRouter = express.Router();
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

tourRouter.route("/").get(getTours).post(createTour);
tourRouter.route('/:id').patch(updateTour).delete(deleteTour).get(getTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route('/:id').patch(updateUser).delete(deleteUser).get(getUser);

//4) Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
