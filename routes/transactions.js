const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Transaction = require("../helpers/transactions");

router.route("/transactions").get(Auth, Transaction.getAllTxns);

router.route("/transactions/user").get(Auth, Transaction.getAllUserTxns);

router.route("/transaction/:txId").get(Auth, Transaction.getOneTxns);

module.exports = router;
