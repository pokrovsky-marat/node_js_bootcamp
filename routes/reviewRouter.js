const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

//GET access to passed params from 'tourRouter', we have to specify {mergeParams:true}
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  )
  .get(reviewController.getReviews);
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);

module.exports = router;
