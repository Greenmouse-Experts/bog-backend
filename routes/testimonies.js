const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const upload = require("../helpers/upload");
const TestimonyController = require("../controllers/TestimonyController");

const { validate, TestimonyValidation } = require("../helpers/validators");

router
  .route("/testimony/testimonies")
  .get(Auth, TestimonyController.getTestimonies);

router
  .route("/testimony/homepage/:testimonyId")
  .patch(Auth, TestimonyController.updateIsHomepage);

router
  .route("/testimony/create")
  .post(
    TestimonyValidation(),
    validate,
    Auth,
    upload.single("image"),
    TestimonyController.CreateTestimony
  );

router
  .route("/testimony/update")
  .patch(validate, Auth, TestimonyController.updateTestimony);

router
  .route("/testimony/delete/:testimonyId")
  .delete(validate, Auth, TestimonyController.deleteTestimony);

module.exports = router;
