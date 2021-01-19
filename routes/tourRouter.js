const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRouter");

const router = express.Router();
//To avoid duplicating code, passed work with 'reviews' to 'reviewRouter'
router.use("/:tourId/reviews", reviewRouter);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead", "guide"),
    tourController.getMonthlyPlan
  );
router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/top-5-cheap")
  .get(tourController.topCheapTours, tourController.getTours);
router
  .route("/")
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead"),
    tourController.createTour
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead"),
    tourController.deleteTour
  )
  .get(tourController.getTour);

module.exports = router;
