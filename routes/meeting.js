const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
// const Access = require("../middleware/access");

const MeetingController = require("../controllers/MeetingController");

const {
  validate,
  meetingStatusValidation,
  meetingValidation
} = require("../helpers/validators");

router.route("/meeting/all").get(Auth, MeetingController.getAllMeeting);

router.route("/meeting/my-meeting").get(Auth, MeetingController.myMeeting);

router
  .route("/meeting/service-meeting")
  .get(Auth, MeetingController.servicePartnerMeetings);

router
  .route("/meeting/action")
  .post(meetingStatusValidation(), Auth, MeetingController.meetingAction);

router
  .route("/meeting/create")
  .post(meetingValidation(), validate, Auth, MeetingController.createMeeting);

router
  .route("/meeting/delete/:meetingId")
  .patch(Auth, MeetingController.deleteMeeting);

router.route("/meeting/zoom").get(MeetingController.viewMeetingPage);

module.exports = router;
