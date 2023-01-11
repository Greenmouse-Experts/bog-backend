/* eslint-disable camelcase */
const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const KYC_Controller = require("../controllers/KYC_Controller");
const upload = require("../helpers/upload");

const { validate, BasicKYCRequirements } = require("../helpers/validators");

router
  .route("/kyc-supply-category/create")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.createSupplyCategories
  );

//
// kyc-financial-data
router
  .route("/kyc-financial-data/create")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.createKycFinancialData
  );

//
// kyc_general_info
router
  .route("/kyc-general-info/create")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.createKycGeneralInfo
  );

//
// kyc_organisation_info
router
  .route("/kyc-organisation-info/create")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.createKycOrganisationInfo
  );

// kyc_tax_permits
router
  .route("/kyc-tax-permits/create")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.createKycTaxPermits
  );

// kyc_work_experience
router
  .route("/kyc-work-experience/create")
  .post(
    validate,
    Auth,
    upload.single("photo"),
    KYC_Controller.createKycWorkExperience
  );

// kyc_documents
router
  .route("/kyc-documents/create")
  .post(validate, Auth, upload.any(), KYC_Controller.createKycDocuments);

module.exports = router;
