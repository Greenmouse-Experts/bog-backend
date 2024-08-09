const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const ComplaintsController = require("../controllers/ComplaintsController");
// const { validate } = require("../helpers/validators");

router
  .route("/complaints/create")
  .post([Auth, Access.verifyAccess, Access.verifyUser], ComplaintsController.CreateComplaint);

router.route("/complaints/issues").get(ComplaintsController.getIssuesCategory)
router.route("/complaints/view/:user_id").get([Auth, Access.verifyAccess, Access.verifyUser], ComplaintsController.getUserComplaints)
router.route("/complaints/view").get([Auth, Access.verifyAccess, Access.verifyAdmin], ComplaintsController.getComplaints)
router.route("/complaints/:id").put([Auth, Access.verifyAccess, Access.verifyAdmin], ComplaintsController.updateComplaint)
// router.route("/review/product/v2/create-review")
//   .post([Auth, Access.verifyAccess], ReviewController.createReviewV2);

// router
//   .route("/review/product/update-review")
//   .patch(validate, [Auth, Access.verifyAccess], ReviewController.updateReview);

// router
//   .route("/review/product/get-review")
//   .get([Auth, Access.verifyAccess], ReviewController.getAllProductReview);

// router
//   .route("/review/product/delete-review")
//   .delete([Auth, Access.verifyAccess], ReviewController.deleteReview);

// // service partner review
// router
//   .route("/review/service/create-review")
//   .post([Auth, Access.verifyAccess], ReviewController.createServiceReview);
// router
//   .route("/review/service/update-review")
//   .patch(validate, [Auth, Access.verifyAccess], ReviewController.updateServiceReview);

// router
//   .route("/review/service/get-review")
//   .get([Auth, Access.verifyAccess], ReviewController.getAllServiceReview);

// router
//   .route("/review/service/delete-review")
//   .delete([Auth, Access.verifyAccess], ReviewController.deleteServiceReview);


// // review project partner working/worked on project
// router
// .route("/review/project/create-review")
// .post([Auth, Access.verifyAccess, Access.verifyUser], ReviewController.createProjectReview);

// router
// .route("/review/project/update-review")
// .patch(validate, [Auth, Access.verifyAccess, Access.verifyUser], ReviewController.updateProjectReview);

// router
// .route("/review/project/get-review/:clientId")
// .get([Auth, Access.verifyAccess, Access.verifyUser], ReviewController.getAllProjectReview);

// router
// .route("/review/project/delete-review")
// .delete([Auth, Access.verifyAccess, Access.verifyUser], ReviewController.deleteProjectReview);

module.exports = router;
