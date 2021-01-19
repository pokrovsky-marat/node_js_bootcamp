const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/top-5-cheap")
  .get(tourController.topCheapTours, tourController.getTours);
router
  .route("/")
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour);
router
  .route("/:id")
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead"),
    tourController.deleteTour
  )
  .get(tourController.getTour);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );
module.exports = router;
