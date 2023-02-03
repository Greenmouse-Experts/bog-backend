/* eslint-disable camelcase */
const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const KYC_Controller = require("../controllers/KYC_Controller");
const upload = require("../helpers/upload");

const {
  validate,
  BasicKYCRequirements,
  KYCApprovalValidation
} = require("../helpers/validators");

const {
  createSupplyCategories,
  ReadSupplyCategories,
  createKycFinancialData,
  ReadKycFinancialData,
  createKycGeneralInfo,
  ReadKycGeneralInfo,
  createKycOrganisationInfo,
  ReadKycOrganisationInfo,
  createKycTaxPermits,
  ReadKycTaxPermits,
  createKycWorkExperience,
  ReadKycWorkExperience,
  deleteKycWorkExperience,
  createKycDocuments,
  ReadKycDocuments,
  deleteKycDocuments,
  approveKycVerification,
  getUserKycDetails
} = KYC_Controller;

router
  .route("/kyc-supply-category/create")
  .post(BasicKYCRequirements(), validate, [Auth, Access.verifyAccess], createSupplyCategories);

router.route("/kyc-supply-category/fetch").get([Auth, Access.verifyAccess], ReadSupplyCategories);

// kyc-financial-data
router
  .route("/kyc-financial-data/create")
  .post(BasicKYCRequirements(), validate, [Auth, Access.verifyAccess], createKycFinancialData);

router.route("/kyc-financial-data/fetch").get([Auth, Access.verifyAccess], ReadKycFinancialData);
//
// kyc_general_info
router
  .route("/kyc-general-info/create")
  .post(BasicKYCRequirements(), validate, [Auth, Access.verifyAccess], createKycGeneralInfo);

router.route("/kyc-general-info/fetch").get([Auth, Access.verifyAccess], ReadKycGeneralInfo);

//
// kyc_organisation_info
router
  .route("/kyc-organisation-info/create")
  .post(BasicKYCRequirements(), validate, [Auth, Access.verifyAccess], createKycOrganisationInfo);

router.route("/kyc-organisation-info/fetch").get([Auth, Access.verifyAccess], ReadKycOrganisationInfo);

// kyc_tax_permits
router
  .route("/kyc-tax-permits/create")
  .post(BasicKYCRequirements(), validate, [Auth, Access.verifyAccess], createKycTaxPermits);

router.route("/kyc-tax-permits/fetch").get([Auth, Access.verifyAccess], ReadKycTaxPermits);

// kyc_work_experience
router
  .route("/kyc-work-experience/create")
  .post(validate, [Auth, Access.verifyAccess], upload.single("document"), createKycWorkExperience);

router.route("/kyc-work-experience/fetch").get([Auth, Access.verifyAccess], ReadKycWorkExperience);

router
  .route("/kyc-work-experience/delete/:id")
  .delete(validate, [Auth, Access.verifyAccess], deleteKycWorkExperience);

// kyc_documents
router
  .route("/kyc-documents/create")
  .post(validate, [Auth, Access.verifyAccess], upload.any(), createKycDocuments);

router.route("/kyc-documents/fetch").get([Auth, Access.verifyAccess], ReadKycDocuments);

router
  .route("/kyc-documents/delete/:id")
  .delete(validate, [Auth, Access.verifyAccess], deleteKycDocuments);

router
  .route("/kyc/admin-approval")
  .post(KYCApprovalValidation(), validate, [Auth, Access.verifyAccess], approveKycVerification);

router.route("/kyc/user-kyc/:userId").get([Auth, Access.verifyAccess], getUserKycDetails);

module.exports = router;
