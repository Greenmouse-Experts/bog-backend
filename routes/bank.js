const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const PaystackController = require("../controllers/PaystackController");

const { validate, bankValidation } = require("../helpers/validators");

router.route("/bank/allbanks").get(PaystackController.getBanks);

router.route("/bank/get-bank").get(Auth, PaystackController.getBankDetail);

router
  .route("/bank/save-bank")
  .post(bankValidation(), validate, Auth, PaystackController.saveBankDetail);

module.exports = router;
