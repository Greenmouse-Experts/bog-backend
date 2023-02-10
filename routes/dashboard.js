const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const DashboardController = require("../controllers/DashboardController");

router
  .route("/dashboard/service-projects/:userId")
  .get(Auth, DashboardController.getServicePartnerProjects);

module.exports = router;
