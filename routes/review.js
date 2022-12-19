const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const ReviewController = require("../controllers/ReviewsController");
const { validate } = require("../helpers/validators");

router
  .route("/review/product/create-review")
  .post(Auth, ReviewController.createReview);

router
  .route("/review/product/update-review")
  .patch(validate, Auth, ReviewController.updateReview);

router
  .route("/review/product/get-review")
  .get(Auth, ReviewController.getAllProductReview);

router
  .route("/review/product/delete-review")
  .delete(Auth, ReviewController.deleteReview);

// service partner review
router
  .route("/review/service/create-review")
  .post(Auth, ReviewController.createServiceReview);
router
  .route("/review/service/update-review")
  .patch(validate, Auth, ReviewController.updateServiceReview);

router
  .route("/review/service/get-review")
  .get(Auth, ReviewController.getAllServiceReview);

router
  .route("/review/service/delete-review")
  .delete(Auth, ReviewController.deleteServiceReview);

module.exports = router;
