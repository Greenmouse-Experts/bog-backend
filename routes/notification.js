const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const NotificationController = require("../controllers/NotificationController");

router
  .route("/notifications/admin")
  .get(
    [Auth, Access.verifyAccess],
    NotificationController.getAllAdminNotifications
  );

router
  .route("/notifications/user/:userId")
  .get([Auth, Access.verifyAccess], NotificationController.getAllAUserNotifications);

router
  .route("/notifications/mark-read/:notificationId")
  .patch(Auth, NotificationController.markNotificationAsRead);

router
  .route("/notifications/delete/:notificationId")
  .delete(Auth, NotificationController.deleteNotification);

module.exports = router;
