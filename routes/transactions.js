const express = require('express');

const router = express.Router();
const Auth = require('../middleware/auth');
const Access = require('../middleware/access');

const Transaction = require('../helpers/transactions');
const { trxProofValidation, validate } = require('../helpers/validators');

router
  .route('/transactions')
  .get([Auth, Access.verifyAccess], Transaction.getAllTxns);

router
  .route('/transactions/user')
  .get([Auth, Access.verifyAccess], Transaction.getAllUserTxns);

router
  .route('/transaction/:txId')
  .get([Auth, Access.verifyAccess], Transaction.getOneTxns);

router
  .route('/transaction/save-proof/:txId')
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    trxProofValidation(),
    validate,
    Transaction.addTrxProof
  );

module.exports = router;
