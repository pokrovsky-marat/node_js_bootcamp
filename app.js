const express = require("express");
const fs = require("fs");

const app = express();
const tours = JSON.parse(
    fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);
app.use(express.json());
app.get("/api/v1/tours", (req, res) => {
    res
        .status(200)
        .json({status: "success", results: tours.length, data: {tours}});
});
app.get("/api/v1/tours/:id", (req, res) => {
    let id = req.params.id;
    if (id > tours.length) {
        return res.status(404).json({status: "fail", message: "Invalid ID"});
    }
    let tour = tours.find((el) => {
        return el.id == id; //id is a string === is not equal
    });
    res.status(200).json({status: "success", data: {tour}});
});

app.post("/api/v1/tours", (req, res) => {
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
});
app.patch('/api/v1/tours/:id', (req, res) => {
    console.log(req.body)
    res.json({
        status: "success",
        message: 'Ok'
    })
});
app.delete("/api/v1/tours/:id", (req, res) => {

    res.status(204).json({
        status: "success",
        data: {
            message: "Ok ",
        },
    });


});
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
