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
const { getUserTypeProfile } = require("../service/UserService");

// supply Categories controllers
exports.createSupplyCategories = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const myCategories = await SupplyCategory.create(data, {
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
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const myCategories = await SupplyCategory.update(data, {
        where: { userId },
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

//
//
//
// Financial Data controllers
exports.createKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const myFinancial = await KycFinancialData.create(data, {
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

exports.updateKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const myFinancial = await KycFinancialData.update(data, {
        where: { userId },
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

//
//
//
// General Info controllers
exports.createKycGeneralInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const myInfo = await KycGeneralInfo.create(data, {
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

exports.updateKycGeneralInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const updatedInfo = await KycGeneralInfo.update(data, {
        where: { userId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: updatedInfo
      });
    } catch (error) {
      return next(error);
    }
  });
};

//
//
//
//
// Organisation Info controllers
exports.createKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const OrganisationInfo = await KycOrganisationInfo.create(data, {
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

exports.updateKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const updatedInfo = await KycOrganisationInfo.update(data, {
        where: { userId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: updatedInfo
      });
    } catch (error) {
      return next(error);
    }
  });
};

//
//
//
//
// Tax Permits controllers
exports.createKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const taxPermits = await KycTaxPermits.create(data, {
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

exports.updateKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const updatedTaxPermits = await KycTaxPermits.update(data, {
        where: { userId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: updatedTaxPermits
      });
    } catch (error) {
      return next(error);
    }
  });
};

//
//
//
//
// Work Experience controllers
exports.createKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const experiences = await KycWorkExperience.create(data, {
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

exports.updateKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const updatedExperiences = await KycWorkExperience.update(data, {
        where: { userId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: updatedExperiences
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
      const { userId, userType } = req.body;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const documents = await KycDocuments.create(data, {
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
