const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect,authController.restrictTo('user'),reviewController.createReview)
  .get(reviewController.getReviews);
router.route("/:id").get(reviewController.getReview);
module.exports = router;
