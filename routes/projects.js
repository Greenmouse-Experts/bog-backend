const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const upload = require("../helpers/upload");

const {
  validate,
  landSurveyRequestValidation,
  projectAssignmentRequestValidation,
  projectBidRequestValidation,
  projectApplyRequestValidation,
  projectProgressValidation,
  projectInstallmentValidation,
  paymentInstallmentValidation,
  projectNotificationValidation,
} = require("../helpers/validators");
const ProjectController = require("../controllers/ProjectController");

// Projects
router
  .route("/projects/my-request")
  .get(Auth, ProjectController.getProjectRequest);

router
  .route("/projects/service-request")
  .get(Auth, ProjectController.getServicePartnerProjectRequest);

router
  .route("/projects/dispatched-projects/:userId")
  .get(Auth, ProjectController.getDispatchedProject);

// Get dispatched projects v2
// router.route('/projects/v2/dispatched-projects/:userId')
//   .get(Auth, ProjectController.getV2DispatchedProject)

router
  .route("/projects/assigned-projects/:userId")
  .get(Auth, ProjectController.getAssignedProjects);

// Update project's progress
router
  .route("/projects/progress/:providerId/:projectId")
  .put(
    projectProgressValidation(),
    validate,
    [Auth, Access.verifyAccess, Access.verifyUser],
    ProjectController.updateProjectProgress
  );

router.route("/projects/update/:projectId")
    .put([Auth, Access.verifyAccess, Access.verifyAdmin], ProjectController.updateProjectDetails);

// Get assigned projects v2
// router
//   .route("/projects/v2/assigned-projects/:userId")
//   .get(Auth, ProjectController.getV2AssignedProjects);

router.route("/projects/all").get(Auth, ProjectController.getAllProjectRequest);


router
  .route("/projects/v2/all")
  .get([Auth, Access.verifyAccess], ProjectController.getAllProjectRequestV2);

// View all project v2 ?y=${year} default is present year
router.route("/projects/analyze")
  .get([Auth, Access.verifyAccess], ProjectController.analyzeProjects)

// View all project v2 ?y=${year} default is present year
router.route("/projects/service-partner-analyze")
  .get([Auth, Access.verifyAccess, Access.verifyUser], ProjectController.analyzeServicePartnerProjects)

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
  .post(
    [Auth, Access.verifyAccess, Access.verifyUser],
    ProjectController.requestForService
  );

// Land Survey
router
  .route("/projects/land-survey/request")
  .post(
    landSurveyRequestValidation(),
    validate,
    Auth,
    ProjectController.requestForLandSurvey
  );

router
  .route("/projects/land-survey/update-request")
  .patch(Auth, ProjectController.updateLandSurveyRequest);

// Contractor Project
router
  .route("/projects/contractor/request")
  .post(Auth, upload.any(), ProjectController.requestForContractor);

router
  .route("/projects/contractor/update-request")
  .patch(Auth, upload.any(), ProjectController.updateContractorRequest);

// Drawing Project
router
  .route("/projects/drawing/request")
  .post(Auth, upload.any(), ProjectController.drawingProjectsRequest);

router
  .route("/projects/drawing/update-request")
  .patch(Auth, upload.any(), ProjectController.updateDrawingRequest);

// Building Approval Project
router
  .route("/projects/building-approval/request")
  .post(Auth, upload.any(), ProjectController.buildingApprovalProjectsRequest);

router
  .route("/projects/building-approval/update-request")
  .patch(Auth, upload.any(), ProjectController.updateBuildingApprovalRequest);

// Geotechnical Project
router
  .route("/projects/geotechnical/request")
  .post(
    Auth,
    upload.any(),
    ProjectController.requestForGeoTechnicalInvestigation
  );

router
  .route("/projects/geotechnical/update-request")
  .patch(
    Auth,
    upload.any(),
    ProjectController.updateGeoTechnicalInvestigationRequest
  );

router
  .route("/projects/request-for-approval/:projectId")
  .patch(Auth, ProjectController.requestProjectApproval);


router
  .route("/projects/approve-project/:projectId")
  .patch([Auth, Access.verifyAccess, Access.verifyAdmin], ProjectController.approveProjectRequest);

// 1 // list competent providers 
router
  .route("/projects/list-providers/:projectId")
  .put([Auth, Access.verifyAccess, Access.verifyAdmin], ProjectController.listCapableServiceProviders)

// 2 // dispatch to selected providers from the list
router
  .route("/projects/v2/dispatch-project/:projectId")
  .put([Auth, Access.verifyAccess, Access.verifyAdmin], ProjectController.selectivelyDispatchProject)

router
  .route("/projects/dispatch-project/:projectId")
  .patch(Auth, ProjectController.dispatchProject);

router
  .route("/projects/assign-project")
  .post(
    projectAssignmentRequestValidation(),
    validate,
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    ProjectController.assignProject
  );

router.route("/projects/installments/create")
  .post([Auth, Access.verifyAccess, Access.verifyAdmin], projectInstallmentValidation(), validate, ProjectController.createProjectInstallment)

// Get project installments ?type=${cost | installment}
router.route("/projects/installments/:project_id/view") 
  .get([Auth, Access.verifyAccess], ProjectController.viewProjectInstallment)

// Pay project installment
router.route("/projects/installments/:projectId/payment")
  .post([Auth, Access.verifyAccess, Access.verifyUser], paymentInstallmentValidation(), validate, ProjectController.payProjectInstallment);

// Transfer to service partners
router.route("/projects/transfer/:projectId")
  .post([Auth, Access.verifyAccess, Access.verifyAdmin], ProjectController.transferToServicePartner);

router
  .route("/projects/pendingTransfers")
  .get([Auth, Access.verifyAccess, Access.verifyAdmin],
    ProjectController.getPendingTransfers
  );

router
  .route("/projects/approveTransfer/:id")
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    ProjectController.approveTransferToServicePartner
  );

// Add Project notification
router.route("/projects/notification/create")
  .post([Auth, Access.verifyAccess], projectNotificationValidation(), validate, ProjectController.createProjectNotification)

// View project notifications
router.route("/projects/notification/:projectId/view")
  .get([Auth, Access.verifyAccess], ProjectController.viewProjectNotifications)

router
  .route("/projects/bid-project")
  .post(
    [Auth, Access.verifyAccess, Access.verifyUser],
    upload.any(),
    ProjectController.bidForProject
  );

router
  .route("/projects/apply-project")
  .post(
    projectApplyRequestValidation(),
    validate,
    [Auth, Access.verifyAccess, Access.verifyUser],
    ProjectController.applyForProject
  );

router.route("/projects/bids/:projectId").get(ProjectController.getProjectBids);

router
  .route("/projects/individual-bid/:projectId/:userId")
  .get(ProjectController.getIndividualProjectBid);

module.exports = router;
