const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const ReviewController = require("../controllers/ReviewsController");
const { validate } = require("../helpers/validators");


router.route("/review/create-review").post(Auth, ReviewController.createReview);
router
  .route("/review/update-review")
  .patch(validate, Auth, ReviewController.updateReview);

router
  .route("/review/get-product-review")
  .get(Auth, ReviewController.getAllProductReview);
  
router
  .route("/review/delete-review")
  .delete(Auth, ReviewController.deleteReview);



module.exports = router;
