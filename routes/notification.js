const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const NotificationController = require("../controllers/NotificationController");

router
  .route("/notifications/admin")
  .get(Auth, NotificationController.getAllAdminNotifications);

router
  .route("/notifications/user/:userId")
  .get(Auth, NotificationController.getAllAUserNotifications);
router
  .route("/notifications/mark-read/:notificationId")
  .patch(NotificationController.markNotificationAsRead);

module.exports = router;
