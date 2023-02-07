const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

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
  .route("/subscription/history")
  .get(SubscriptionController.getSubscriptionHistory);

router
  .route("/subscription/user-history/:userId")
  .get(Auth, SubscriptionController.getUserSubscriptionHistory);

router
  .route("/subscription/update")
  .patch(SubscriptionController.updateSubscriptionPlan);

router
  .route("/subscription/delete/:planId")
  .delete(
    [Auth, Access.verifyAccess],
    SubscriptionController.deleteSubscriptionPlan
  );

router
  .route("/subscription/subscribe")
  .post(
    subscribeRequestValidation(),
    validate,
    [Auth, Access.verifyAccess],
    SubscriptionController.subscribeToPlan
  );

module.exports = router;
