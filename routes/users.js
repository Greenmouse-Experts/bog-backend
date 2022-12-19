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
  changePasswordValidation,
  adminValidation
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

router.route("/user/switch-account").post(Auth, UserController.switchAccount);

router.route("/user/get-accounts").get(Auth, UserController.getAccounts);

router
  .route("/admin/login")
  .post(loginValidation(), validate, UserController.loginAdmin);

router.route("/user/me").get(Auth, UserController.getLoggedInUser);

router.route("/user/verify").get(UserController.verifyUser);

router.route("/user/resend-token").post(UserController.resendCode);

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
  .patch(Auth, upload.single("photo"), UserController.updateUserAccount);

router
  .route("/user/update-profile")
  .patch(Auth, upload.any(), UserController.updateUserProfile);

router.route("/all/users").get(Auth, UserController.getAllUsers);

router
  .route("/admin/signup")
  .post(adminValidation(), validate, UserController.registerAdmin);

router.route("/all/admin").get(Auth, UserController.getAllAdmin);

router.route("/admin/:adminId").get(Auth, UserController.findAdmin);

router.route("/admin/revoke-access").post(Auth, UserController.revokeAccess);

router.route("/users/get-user/:userId").get(UserController.findSingleUser);

module.exports = router;
