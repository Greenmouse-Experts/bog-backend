const express = require("express");
const passport = require("passport")

const router = express.Router();
const UserController = require("../controllers/UserController");
const upload = require("../helpers/upload");
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const {
  validate,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation,
  adminValidation,
  resetAdminPasswordValidation,
  contactValidation,
  facebookLoginValidation,
  googleLoginValidation,
  facebookSignupValidation,
  googleSignValidation,
  appleSignValidation,
  tokenValidation
} = require("../helpers/validators");
const refreshAuth = require("../middleware/refreshAuth");


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

router
  .route("/user/refresh-token")
  .get(refreshAuth, UserController.refreshToken);

/**
 * Facebook signin * signup
 */
router.route("/user/facebook/login").post(passport.authenticate('facebook', { session: false }) 
// UserController.testfblogin
);
router
  .route("/user/auth/facebook-signup")
  .post(facebookSignupValidation(), validate, [Access.authenticateFBSignup], UserController.facebookSignup);
// router.route("/user/auth/facebook-signin").post([facebookLoginValidation(), validate], [Access.authenticateFBSignin], UserController.facebookSignin);

/**
 * Apple signin and signup
 */
router.route("/users/auth/apple").post([appleSignValidation(), validate], Access.authenticateAppleSignin, UserController.appleSign);


/**
 * Google signin and signup
 */
router.route("/users/auth/google").post([googleSignValidation(), validate], Access.authenticateGoogleSignin, UserController.googleSign);
router.route("/user/auth/google-signin").post([googleLoginValidation(), validate], UserController.googleSignin);

router.route("/user/switch-account").post(Auth, UserController.switchAccount);

router.route("/user/get-accounts").get(Auth, UserController.getAccounts);

router.route("/user/delete").delete(Auth, UserController.deleteAccount)
router
  .route("/admin/login")
  .post(loginValidation(), validate, UserController.loginAdmin);

router.route("/user/me").get(Auth, UserController.getLoggedInUser);

router.route("/user/verify").post(UserController.verifyUser);
router.route("/user/verifyemail").get(UserController.verifyUserEmail);

router
  .route("/user/verify/login")
  .post(loginValidation(), validate, UserController.verifyLogin);

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
  .route("/user/contact-admin")
  .post(contactValidation(), validate, UserController.contactAdmin);

router
  .route("/user/reset-password")
  .post(resetPasswordValidation(), validate, UserController.resetPassword);

router
  .route("/admin/reset-password/:id")
  .put(
    resetAdminPasswordValidation(),
    validate,
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    UserController.resetUserPassword
  );

router
  .route("/user/update-account")
  .patch(Auth, upload.single("photo"), UserController.updateUserAccount);

router
  .route("/user/update-profile")
  .patch(Auth, upload.any(), UserController.updateUserProfile);

router
  .route("/user/delete-account/:id")
  .delete(
    Auth, 
    UserController.deleteUser
  );

router
  .route("/all/users")
  .get([Auth, Access.verifyAccess], UserController.getAllUsers);

// Get users analysis ?y=${year}
router
  .route("/all/users/analyze")
  .get(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    UserController.analyzeUser
  );

router
  .route("/admin/signup")
  .post(adminValidation(), validate, UserController.registerAdmin);

router
  .route("/all/admin")
  .get([Auth, Access.verifyAccess], UserController.getAllAdmin);
router
  .route("/all/projectAdmin")
  .get([Auth, Access.verifyAccess], UserController.getAllProjectAdmin);
router
  .route("/all/productAdmin")
  .get([Auth, Access.verifyAccess], UserController.getAllProductAdmin);
router
  .route("/all/generalAdmin")
  .get([Auth, Access.verifyAccess], UserController.getAllGeneralAdmin);

  router
    .route("/all/chatAdmins")
    .get([Auth, Access.verifyAccess], UserController.getChatAdmins);

router
  .route("/admin/:adminId")
  .get([Auth, Access.verifyAccess], UserController.findAdmin);

router
  .route("/admin/revoke-access")
  .post([Auth, Access.verifyAccess], UserController.revokeAccess);

router
  .route("/admin/suspend-user")
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    UserController.suspendUser
  );

router
  .route("/admin/unsuspend-user")
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    UserController.unsuspendUser
  );

router
  .route("/admin/delete-user/:id")
  .delete(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    UserController.deleteUser
  );

router.route("/users/get-user/:userId").get(UserController.findSingleUser);

module.exports = router;
