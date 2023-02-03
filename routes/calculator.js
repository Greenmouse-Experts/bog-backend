const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const CalculatorController = require("../controllers/CalculatorController");

const { validate, CalculatorCalculator } = require("../helpers/validators");

router
  .route("/calculator-settings/create")
  .post(
    CalculatorCalculator(),
    validate,
    [Auth, Access.verifyAccess],
    CalculatorController.createRate
  );

router
  .route("/calculator-settings/update/:id")
  .post([Auth, Access.verifyAccess], CalculatorController.UpdateRate);
router
  .route("/calculator-settings/delete/:id")
  .delete(CalculatorController.DeleteRate);

router.route("/calculator-settings/all").get(CalculatorController.ReadRate);

module.exports = router;
