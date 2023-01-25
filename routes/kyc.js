/* eslint-disable camelcase */
const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
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
  approveKycVerification
} = KYC_Controller;

router
  .route("/kyc-supply-category/create")
  .post(BasicKYCRequirements(), validate, Auth, createSupplyCategories);

router.route("/kyc-supply-category/fetch").get(Auth, ReadSupplyCategories);

// kyc-financial-data
router
  .route("/kyc-financial-data/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycFinancialData);

router.route("/kyc-financial-data/fetch").get(Auth, ReadKycFinancialData);
//
// kyc_general_info
router
  .route("/kyc-general-info/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycGeneralInfo);

router.route("/kyc-general-info/fetch").get(Auth, ReadKycGeneralInfo);

//
// kyc_organisation_info
router
  .route("/kyc-organisation-info/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycOrganisationInfo);

router.route("/kyc-organisation-info/fetch").get(Auth, ReadKycOrganisationInfo);

// kyc_tax_permits
router
  .route("/kyc-tax-permits/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycTaxPermits);

router.route("/kyc-tax-permits/fetch").get(Auth, ReadKycTaxPermits);

// kyc_work_experience
router
  .route("/kyc-work-experience/create")
  .post(validate, Auth, upload.single("document"), createKycWorkExperience);

router.route("/kyc-work-experience/fetch").get(Auth, ReadKycWorkExperience);

router
  .route("/kyc-work-experience/delete/:id")
  .delete(validate, Auth, deleteKycWorkExperience);

// kyc_documents
router
  .route("/kyc-documents/create")
  .post(validate, Auth, upload.any(), createKycDocuments);

router.route("/kyc-documents/fetch").get(Auth, ReadKycDocuments);

router
  .route("/kyc-documents/delete/:id")
  .delete(validate, Auth, deleteKycDocuments);

router
  .route("/kyc/admin-approval")
  .post(KYCApprovalValidation(), validate, Auth, approveKycVerification);

module.exports = router;
