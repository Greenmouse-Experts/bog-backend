const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");
const AdminMessageController = require("../controllers/AdminMessageController");

const upload = require("../helpers/upload");

router
  .route("/announcements/all")
  .get(AdminMessageController.viewAnnouncements);

router
  .route("/announcements")
  .get([Auth, Access.verifyAccess], AdminMessageController.allAdminMessages);

router
  .route("/announcements/delete-message/:id")
  .delete([Auth, Access.verifyAccess], AdminMessageController.deleteAnnouncement);

router
  .route("/announcements/new-announcement")
  .post(
    [Auth, Access.verifyAccess],
    upload.single("supportingDocument"),
    AdminMessageController.postAnnouncement
  );

module.exports = router;
