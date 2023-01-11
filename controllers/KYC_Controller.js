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
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getCategories = await SupplyCategory.findOne({
        where: { userId: profile.id }
      });
      if (getCategories) {
        const myCategories = await SupplyCategory.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: myCategories
        });
      }
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

//
//
//
// Financial Data controllers
exports.createKycFinancialData = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      let myFinancial = await KycFinancialData.findOne({
        where: { userId: profile.id }
      });
      if (myFinancial) {
        await KycFinancialData.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
      } else {
        myFinancial = await KycFinancialData.create(data, {
          transaction: t
        });
      }

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
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getMyInfo = await KycGeneralInfo.findOne({
        where: { userId: profile.id }
      });
      if (getMyInfo) {
        const updatedInfo = await KycGeneralInfo.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedInfo
        });
      }
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
//
//
//
//
// Organisation Info controllers
exports.createKycOrganisationInfo = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getOrgInfo = await KycOrganisationInfo.findOne({
        where: { userId: profile.id }
      });
      if (getOrgInfo) {
        const updatedOrgInfo = await KycOrganisationInfo.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedOrgInfo
        });
      }
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

//
//
//
//
// Tax Permits controllers
exports.createKycTaxPermits = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const data = {
        ...req.body,
        userId: profile.id
      };
      const getPermits = await KycTaxPermits.findOne({
        where: { userId: profile.id }
      });
      if (getPermits) {
        const updatedPermits = await KycTaxPermits.update(req.body, {
          where: { userId: profile.id },
          transaction: t
        });
        return res.status(200).send({
          success: true,
          data: updatedPermits
        });
      }
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

//
//
//
//
// Work Experience controllers
exports.createKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const url = `${process.env.APP_URL}/${req.file.path}`;

      const data = {
        ...req.body,
        userId: profile.id,
        fileUrl: url
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

exports.UpdateKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const { jobId } = req.params;
      const url = `${process.env.APP_URL}/${req.file.path}`;

      const data = {
        ...req.body,
        userId: profile.id,
        fileUrl: url
      };
      const updatedExperience = await KycWorkExperience.update(data, {
        where: { id: jobId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: updatedExperience
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.deleteKycWorkExperience = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { jobId } = req.params;
      await KycWorkExperience.destroy({
        where: { id: jobId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Work deleted successfully"
      });
    } catch (error) {
      return next(error);
    }
  });
};

// Kyc Documents controllers
exports.createKycDocuments = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const profile = await getUserTypeProfile(userType, userId);
      const loadFiles = req.files.map((file, i) => ({
        name: file.fieldname,
        file: `${process.env.APP_URL}/${req.file.path}`,
        userType,
        userId: profile.id
      }));

      const documents = await KycDocuments.bulkCreate(loadFiles, {
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
