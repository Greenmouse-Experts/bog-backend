const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const TestimonyController = require("../controllers/TestimonyController");

const { validate, TestimonyValidation } = require("../helpers/validators");

router
  .route("/testimony/testimonies")
  .get(Auth, TestimonyController.getTestimonies);

router
  .route("/testimony/get-hompage-testimonies")
  .get(TestimonyController.getHompageTestimonies);

router
  .route("/testimony/find-user-testimony")
  .get(Auth, TestimonyController.getUserTestimony);

router
  .route("/testimony/homepage/:testimonyId")
  .patch(Auth, TestimonyController.updateIsHomepage);

router
  .route("/testimony/create")
  .post(
    TestimonyValidation(),
    validate,
    Auth,
    TestimonyController.CreateTestimony
  );

router
  .route("/testimony/update")
  .patch(validate, Auth, TestimonyController.updateTestimony);

router
  .route("/testimony/delete/:testimonyId")
  .delete(validate, Auth, TestimonyController.deleteTestimony);

module.exports = router;
