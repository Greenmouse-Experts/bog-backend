const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
// const Access = require("../middleware/access");

const FeeController = require("../controllers/FeeController");

const {
  validate,
  meetingStatusValidation,
  meetingValidation
} = require("../helpers/validators");
const Access = require("../middleware/access");

router.route("/fees/update-commitment")
    .post([Auth, Access.verifyAccess, Access.verifyAdmin], FeeController.updateCommitment);

router.route("/fees/commitment")
    .get(Auth, FeeController.viewCommitmentFee)

module.exports = router;
