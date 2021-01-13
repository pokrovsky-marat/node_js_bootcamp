const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser);

module.exports = router;
