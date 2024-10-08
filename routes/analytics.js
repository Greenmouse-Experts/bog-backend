const express = require('express');

const router = express.Router();

const Access = require('../middleware/access');
const Auth = require('../middleware/auth');

const AnalyticsController = require('../controllers/AnalyticsController');

router
  .route('/analytics/fetch')
  .get(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    AnalyticsController.getDashboardAnalytics
  );

module.exports = router;
