const express = require('express');

const router = express.Router();
const Auth = require('../middleware/auth');
const Access = require('../middleware/access');
const AdminMessageController = require('../controllers/AdminMessageController');

const upload = require('../helpers/upload');

router
  .route('/announcements/all')
  .get(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    AdminMessageController.viewAnnouncements
  );

router
  .route('/announcements')
  .get([Auth, Access.verifyAccess], AdminMessageController.allAdminMessages);

router
  .route('/announcements/drafted')
  .get(
    [Auth, Access.verifyAccess],
    AdminMessageController.draftedAdminMessages
  );

router
  .route('/announcements/delete-message/:id')
  .delete(
    [Auth, Access.verifyAccess],
    AdminMessageController.deleteAnnouncement
  );

router
  .route('/announcements/new-announcement')
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    upload.single('supportingDocument'),
    AdminMessageController.postAnnouncement
  );

router
  .route('/announcements/mark-as-read/:messageId')
  .post([Auth, Access.verifyAccess], AdminMessageController.markMessageAsRead);

router
  .route('/announcements/update/:messageId')
  .put(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    upload.single('supportingDocument'),
    AdminMessageController.updateAnnouncement
  );

module.exports = router;
