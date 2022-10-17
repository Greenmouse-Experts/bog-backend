const express = require("express");

const router = express.Router();
const UserController = require("../controllers/UserController");
const upload = require("../helpers/upload");
const Auth = require("../middleware/auth");
const {
  validate,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation
} = require("../helpers/validators");

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router
  .route("/user/signup")
  .post(registerValidation(), validate, UserController.registerUser);

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router
  .route("/user/login")
  .post(loginValidation(), validate, UserController.loginUser);

router.route("/user/me").get(Auth, UserController.getLoggedInUser);

router.route("/user/verify").get(UserController.verifyUser);

router.route("/user/forgot-password").get(UserController.forgotPassword);

router
  .route("/user/change-password")
  .patch(
    changePasswordValidation(),
    validate,
    Auth,
    UserController.changePassword
  );

router
  .route("/user/reset-password")
  .post(resetPasswordValidation(), validate, UserController.resetPassword);

router
  .route("/user/update-account")
  .patch(Auth, UserController.updateUserAccount);

router
  .route("/user/update-profile")
  .patch(Auth, upload.any(), UserController.updateUserProfile);

module.exports = router;
