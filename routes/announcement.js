const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const AdminMessageController = require("../controllers/AdminMessageController");

const upload = require("../helpers/upload");

router
  .route("/announcements/all")
  .get(AdminMessageController.viewAnnouncements);

router.route("/announcements").get(AdminMessageController.allAdminMessages);

router
  .route("/announcements/delete-message")
  .delete(Auth, AdminMessageController.deleteAnnouncement);

router
  .route("/announcements/new-announcement")
  .post(upload.any(), Auth, AdminMessageController.postAnnouncement);

module.exports = router;
