const express = require("express");
const fs = require("fs");

const app = express();
const tours = JSON.parse(
    fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);
app.use(express.json());

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
    res.status(200).json({status: "success", data: {tour}});
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

/*app.get("/api/v1/tours", getTours);
app.post("/api/v1/tours", createTour);

app.patch('/api/v1/tours/:id', updateTour);
app.delete("/api/v1/tours/:id", deleteTour);
app.get("/api/v1/tours/:id", getTour);*/

app.route("/api/v1/tours").get(getTours).post(createTour);
app.route('/api/v1/tours/:id').patch(updateTour).delete(deleteTour).get(getTour);
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
