const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const TestimonyController = require("../controllers/TestimonyController");

const { validate, TestimonyValidation } = require("../helpers/validators");

router
  .route("/testimony/testimonies")
  .get([Auth, Access.verifyAccess], TestimonyController.getTestimonies);

router
  .route("/testimony/get-hompage-testimonies")
  .get(TestimonyController.getHompageTestimonies);

router
  .route("/testimony/find-user-testimony")
  .get([Auth, Access.verifyAccess], TestimonyController.getUserTestimony);

router
  .route("/testimony/homepage/:testimonyId")
  .patch([Auth, Access.verifyAccess], TestimonyController.updateIsHomepage);

router
  .route("/testimony/create")
  .post(
    TestimonyValidation(),
    validate,
    [Auth, Access.verifyAccess],
    TestimonyController.CreateTestimony
  );

router
  .route("/testimony/update")
  .patch(validate, [Auth, Access.verifyAccess], TestimonyController.updateTestimony);

router
  .route("/testimony/delete/:testimonyId")
  .delete(validate, [Auth, Access.verifyAccess], TestimonyController.deleteTestimony);

module.exports = router;
