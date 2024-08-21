/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const Auth = require('../middleware/auth');
// const Access = require("../middleware/access");

const KYC_Controller = require('../controllers/KYC_Controller');
const upload = require('../helpers/upload');

const {
  validate,
  BasicKYCRequirements,
  KYCApprovalValidation,
  GeneralInfoRequirements,
  OrganizationInfoRequirements,
  TaxPermitRequirements,
  WorkExperienceRequirements,
} = require('../helpers/validators');
const { verifyAccess, verifyAdmin } = require('../middleware/access');

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
  getUserKycDetails,
  approveDisapproveKycDocument,
} = KYC_Controller;

router
  .route('/kyc-supply-category/create')
  .post(BasicKYCRequirements(), validate, Auth, createSupplyCategories);

router.route('/kyc-supply-category/fetch').get(Auth, ReadSupplyCategories);

// kyc-financial-data
router
  .route('/kyc-financial-data/create')
  .post(BasicKYCRequirements(), validate, Auth, createKycFinancialData);

router.route('/kyc-financial-data/fetch').get(Auth, ReadKycFinancialData);

// kyc_general_info
router.route('/kyc-general-info/create').post(Auth, createKycGeneralInfo);

router.route('/kyc-general-info/fetch').get(Auth, ReadKycGeneralInfo);

//
// kyc_organisation_info
router
  .route('/kyc-organisation-info/create')
  .post(Auth, createKycOrganisationInfo);

router.route('/kyc-organisation-info/fetch').get(Auth, ReadKycOrganisationInfo);

// kyc_tax_permits
router
  .route('/kyc-tax-permits/create')
  .post(TaxPermitRequirements(), validate, Auth, createKycTaxPermits);

router.route('/kyc-tax-permits/fetch').get(Auth, ReadKycTaxPermits);

// kyc_work_experience
router
  .route('/kyc-work-experience/create')
  .post(Auth, upload.single('document'), createKycWorkExperience);

router.route('/kyc-work-experience/fetch').get(Auth, ReadKycWorkExperience);

router
  .route('/kyc-work-experience/delete/:id')
  .delete(validate, Auth, deleteKycWorkExperience);

// kyc_documents
router
  .route('/kyc-documents/create')
  .post(validate, Auth, upload.any(), createKycDocuments);

router.route('/kyc-documents/fetch').get(Auth, ReadKycDocuments);

router
  .route('/kyc-documents/delete/:id')
  .delete(validate, Auth, deleteKycDocuments);

router
  .route('/kyc/admin-approval')
  .post(KYCApprovalValidation(), validate, Auth, approveKycVerification);

router
  .route('/kyc/document/approval/:id/:userId')
  .patch([Auth, verifyAccess, verifyAdmin], approveDisapproveKycDocument);

router.route('/kyc/user-kyc/:userId').get(Auth, getUserKycDetails);

module.exports = router;
