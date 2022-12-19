const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Transaction = require("../helpers/transactions");

const { validate } = require("../helpers/validators");

router
  .route("/transaction/:userId")
  .patch(validate, Auth, Transaction.getAllTxns);

router.route("/transaction").get(validate, Auth, Transaction.getOneTxns);

module.exports = router;
