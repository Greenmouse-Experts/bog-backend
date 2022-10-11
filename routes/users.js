const express = require("express");

const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  validate,
  registerValidation,
  loginValidation
} = require("../helpers/validators");

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router
  .route("/signup")
  .post(registerValidation(), validate, UserController.registerUser);

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router
  .route("/login")
  .post(loginValidation(), validate, UserController.loginUser);

module.exports = router;
