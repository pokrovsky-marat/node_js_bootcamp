const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/updatePassword").patch(authController.updatePassword);
router.route("/forgotPassword").post(authController.forgotPassword);

//All routes bellow this middlware will be protected
router.use(authController.protect);

router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/updateMe").patch(userController.updateMe);
router.route("/deleteMe").delete(userController.deleteMe);
router.route("/getMe").get(userController.getMe, userController.getUser);

//All routes bellow this middlware  only for admins and lead-guides
router.use(authController.restrictTo("admin", "lead"));

router
  .route("/")
  .get(userController.getAllUsers)
router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser);

module.exports = router;
