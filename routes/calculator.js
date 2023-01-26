const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const CalculatorController = require("../controllers/CalculatorController");

const { validate, CalculatorCalculator } = require("../helpers/validators");

router
  .route("/calculator-settings/create")
  .post(
    CalculatorCalculator(),
    validate,
    Auth,
    CalculatorController.createRate
  );

router
  .route("/calculator-settings/update/:id")
  .post(Auth, CalculatorController.UpdateRate);
router
  .route("/calculator-settings/delete/:id")
  .delete(CalculatorController.DeleteRate);

router.route("/calculator-settings/all").get(CalculatorController.ReadRate);

module.exports = router;
