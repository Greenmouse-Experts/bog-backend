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

// router.route("/meeting/all").get(Auth, MeetingController.getAllMeeting);

// router.route("/meeting/my-meeting").get(Auth, MeetingController.myMeeting);

// router
//   .route("/meeting/service-meeting")
//   .get(Auth, MeetingController.servicePartnerMeetings);

// router
//   .route("/meeting/action")
//   .post(meetingStatusValidation(), Auth, MeetingController.meetingAction);

// router
//   .route("/meeting/create")
//   .post(meetingValidation(), validate, Auth, MeetingController.createMeeting);

// router
//   .route("/meeting/delete/:meetingId")
//   .patch(Auth, MeetingController.deleteMeeting);

module.exports = router;
