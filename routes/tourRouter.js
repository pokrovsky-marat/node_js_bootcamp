const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/top-5-cheap")
  .get(tourController.topCheapTours, tourController.getTours);
router.route("/").get(tourController.getTours).post(tourController.createTour);
router
  .route("/:id")
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)
  .get(tourController.getTour);

module.exports = router;
