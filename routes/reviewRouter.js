const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

//GET access to passed params from 'tourRouter', we have to specify {mergeParams:true}
const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route("/")
  .post(
    authController.restrictTo("user"),
    reviewController.addUserAndTourToReqBody,
    reviewController.createReview
  )
  .get(reviewController.getReviews);
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
