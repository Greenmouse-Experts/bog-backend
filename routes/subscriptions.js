const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const SubscriptionController = require("../controllers/SubscriptionController");

const {
  validate,
  subscriptionRequestValidation,
  subscribeRequestValidation
} = require("../helpers/validators");

router
  .route("/subscription/create")
  .post(
    subscriptionRequestValidation(),
    validate,
    SubscriptionController.createSubscriptionPlan
  );

router
  .route("/subscription/plans")
  .get(SubscriptionController.getSubscriptionPlans);

router
  .route("/subscription/plans/:planId")
  .get(SubscriptionController.getSingleSubscriptionPlan);

router
  .route("/subscription/update")
  .patch(SubscriptionController.updateSubscriptionPlan);

router
  .route("/subscription/delete/:planId")
  .delete(Auth, SubscriptionController.deleteSubscriptionPlan);

router
  .route("/subscription/subscribe")
  .post(
    subscribeRequestValidation(),
    validate,
    SubscriptionController.createSubscriptionPlan
  );

module.exports = router;
