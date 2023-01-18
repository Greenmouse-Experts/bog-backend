/* eslint-disable camelcase */
const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const KYC_Controller = require("../controllers/KYC_Controller");
const upload = require("../helpers/upload");

const { validate, BasicKYCRequirements } = require("../helpers/validators");

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
  createKycYearsOfExperience,
  ReadKycYearsExperience
} = KYC_Controller;
router
  .route("/kyc-supply-category/create")
  .post(BasicKYCRequirements(), validate, Auth, createSupplyCategories);

router
  .route("/kyc-supply-category/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadSupplyCategories);
//
// kyc-financial-data
router
  .route("/kyc-financial-data/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycFinancialData);

router
  .route("/kyc-financial-data/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycFinancialData);
//
// kyc_general_info
router
  .route("/kyc-general-info/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycGeneralInfo);

router
  .route("/kyc-general-info/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycGeneralInfo);

//
// kyc_organisation_info
router
  .route("/kyc-organisation-info/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycOrganisationInfo);

router
  .route("/kyc-organisation-info/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycOrganisationInfo);
// kyc_tax_permits
router
  .route("/kyc-tax-permits/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycTaxPermits);

router
  .route("/kyc-tax-permits/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycTaxPermits);

// kyc_work_experience
router
  .route("/kyc-years-experience/create")
  .post(BasicKYCRequirements(), validate, Auth, createKycYearsOfExperience);
router
  .route("/kyc-years-experience/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycYearsExperience);
// kyc_work_experience

router
  .route("/kyc-work-experience/create")
  .post(validate, Auth, upload.single("document"), createKycWorkExperience);
router
  .route("/kyc-work-experience/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycWorkExperience);
router
  .route("/kyc-work-experience/delete/:id")
  .delete(validate, Auth, deleteKycWorkExperience);
// kyc_documents
router
  .route("/kyc-documents/create")
  .post(validate, Auth, upload.any(), createKycDocuments);

router
  .route("/kyc-documents/fetch")
  .post(BasicKYCRequirements(), validate, Auth, ReadKycDocuments);

router
  .route("/kyc-documents/delete/:id")
  .delete(validate, Auth, deleteKycDocuments);

module.exports = router;
