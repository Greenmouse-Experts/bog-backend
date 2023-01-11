/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const sequelize = require("../config/database/connection");
const SupplyCategory = require("../models/KycCategoryOfSuppies");
const KycDocuments = require("../models/KycDocuments");
const KycFinancialData = require("../models/KycFinancialData");
const KycGeneralInfo = require("../models/KycGeneralInfo");
const KycOrganisationInfo = require("../models/KycOrganisationInfo");
const KycTaxPermits = require("../models/KycTaxPermits");
const KycWorkExperience = require("../models/KycWorkExperience");

// supply Categories controllers
exports.createSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const myCategories = await SupplyCategory.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myCategories
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.updateSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const myCategories = await SupplyCategory.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myCategories
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Financial Data controllers
exports.createKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const myFinancial = await KycFinancialData.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myFinancial
      });
    } catch (error) {
      return next(error);
    }
  });
};

// General Info controllers
exports.createKycGeneralInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const myInfo = await KycGeneralInfo.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myInfo
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Organisation Info controllers
exports.createKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const OrganisationInfo = await KycOrganisationInfo.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: OrganisationInfo
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Tax Permits controllers
exports.createKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const taxPermits = await KycTaxPermits.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: taxPermits
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Work Experience controllers
exports.createKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const experiences = await KycWorkExperience.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: experiences
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Kyc Documents controllers
exports.createSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const documents = await KycDocuments.create(req.body, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: documents
      });
    } catch (error) {
      return next(error);
    }
  });
};
