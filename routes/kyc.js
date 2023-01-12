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

router
  .route("/kyc-supply-category/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadSupplyCategories
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

router
  .route("/kyc-financial-data/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycFinancialData
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

router
  .route("/kyc-general-info/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycGeneralInfo
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

router
  .route("/kyc-organisation-info/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycOrganisationInfo
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

router
  .route("/kyc-tax-permits/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycTaxPermits
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
router
  .route("/kyc-work-experience/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycWorkExperience
  );
// kyc_documents
router
  .route("/kyc-documents/create")
  .post(validate, Auth, upload.any(), KYC_Controller.createKycDocuments);

router
  .route("/kyc-documents/fetch")
  .post(
    BasicKYCRequirements(),
    validate,
    Auth,
    KYC_Controller.ReadKycDocuments
  );

module.exports = router;
