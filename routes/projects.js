const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const upload = require("../helpers/upload");

const {
  validate,
  landSurveyRequestValidation,
  projectAssignmentRequestValidation,
  projectBidRequestValidation
  //   contractorRequestValidation
} = require("../helpers/validators");
const ProjectController = require("../controllers/ProjectController");

// Projects
router
  .route("/projects/my-request")
  .get([Auth, Access.verifyAccess], ProjectController.getProjectRequest);

router
  .route("/projects/dispatched-projects/:userId")
  .get([Auth, Access.verifyAccess], ProjectController.getDispatchedProject);

router
  .route("/projects/assigned-projects/:userId")
  .get([Auth, Access.verifyAccess], ProjectController.getAssignedProjects);

router
  .route("/projects/all")
  .get([Auth, Access.verifyAccess], ProjectController.getAllProjectRequest);

  // View all project v2
router
  .route("/projects/v2/all")
  .get([Auth, Access.verifyAccess], ProjectController.getAllProjectRequestV2);


router
  .route("/projects/view-project/:projectId")
  .get([Auth, Access.verifyAccess], ProjectController.viewProjectRequest);

// Project request view v2
router
  .route("/projects/v2/view-project/:projectId")
  .get([Auth, Access.verifyAccess], ProjectController.viewProjectRequestV2);

router
  .route("/projects/delete/:requestId")
  .delete([Auth, Access.verifyAccess], ProjectController.deleteProjectRequest);


// Request service type
router
  .route("/projects/request")
  .post([Auth, Access.verifyAccess], ProjectController.requestForService)

// Land Survey
router
  .route("/projects/land-survey/request")
  .post(
    landSurveyRequestValidation(),
    validate,
    [Auth, Access.verifyAccess],
    ProjectController.requestForLandSurvey
  );

router
  .route("/projects/land-survey/update-request")
  .patch(
    [Auth, Access.verifyAccess],
    ProjectController.updateLandSurveyRequest
  );

// Contractor Project
router
  .route("/projects/contractor/request")
  .post(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.requestForContractor
  );

router
  .route("/projects/contractor/update-request")
  .patch(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.updateContractorRequest
  );

// Drawing Project
router
  .route("/projects/drawing/request")
  .post(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.drawingProjectsRequest
  );

router
  .route("/projects/drawing/update-request")
  .patch(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.updateDrawingRequest
  );

// Building Approval Project
router
  .route("/projects/building-approval/request")
  .post(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.buildingApprovalProjectsRequest
  );

router
  .route("/projects/building-approval/update-request")
  .patch(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.updateBuildingApprovalRequest
  );

// Geotechnical Project
router
  .route("/projects/geotechnical/request")
  .post(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.requestForGeoTechnicalInvestigation
  );

router
  .route("/projects/geotechnical/update-request")
  .patch(
    [Auth, Access.verifyAccess],
    upload.any(),
    ProjectController.updateGeoTechnicalInvestigationRequest
  );

router
  .route("/projects/request-for-approval/:projectId")
  .patch([Auth, Access.verifyAccess], ProjectController.requestProjectApproval);

router
  .route("/projects/approve-project/:projectId")
  .patch([Auth, Access.verifyAccess], ProjectController.approveProjectRequest);

router
  .route("/projects/dispatch-project/:projectId")
  .patch([Auth, Access.verifyAccess], ProjectController.dispatchProject);

router
  .route("/projects/assign-project")
  .post(
    projectAssignmentRequestValidation(),
    validate,
    [Auth, Access.verifyAccess],
    ProjectController.assignProject
  );

router
  .route("/projects/bid-project")
  .post(
    projectBidRequestValidation(),
    validate,
    [Auth, Access.verifyAccess],
    ProjectController.bidForProject
  );

router.route("/projects/bids/:projectId").get(ProjectController.getProjectBids);

router
  .route("/projects/individual-bid/:projectId/:userId")
  .get(ProjectController.getIndividualProjectBid);

module.exports = router;
