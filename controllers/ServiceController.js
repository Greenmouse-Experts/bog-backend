/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Services = require("../models/Services");
const ServiceType = require("../models/ServiceType");

exports.CreateServiceType = async (req, res, next) => {
  try {
    const type = await ServiceType.create(req.body);
    const data = await this.getServiceProviderDetails(type.id);
    return res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    return next(error);
  }
};

exports.getServiceTypes = async (req, res, next) => {
  try {
    const types = await ServiceType.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Services,
          as: "service"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: types
    });
  } catch (error) {
    return next(error);
  }
};

exports.getServiceProviderDetails = async id => {
  const serviceProvider = await ServiceType.findOne({
    where: { id },
    include: [
      {
        model: Services,
        as: "service"
      }
    ]
  });
  return serviceProvider;
};

exports.findServiceType = async (req, res, next) => {
  try {
    const types = await this.getServiceProviderDetails(req.params.typeId);
    return res.status(200).send({
      success: true,
      data: types
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateServiceType = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { typeId, ...update } = req.body;
      const getTheType = await ServiceType.findOne({
        where: { id: typeId }
      });
      if (!getTheType) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await ServiceType.update(update, {
        where: { id: typeId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: getTheType
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { typeId } = req.params;
      const getTheType = await ServiceType.findOne({
        where: { id: typeId }
      });
      if (!getTheType) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await ServiceType.destroy({ where: { id: typeId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Service type deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// BOG Services

exports.createService = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const type = await Services.create(req.body, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: type
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getServices = async (req, res, next) => {
  try {
    const types = await Services.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).send({
      success: true,
      data: types
    });
  } catch (error) {
    return next(error);
  }
};

exports.findSingleService = async (req, res, next) => {
  try {
    const types = await Services.findOne({
      where: { id: req.params.typeId }
    });
    return res.status(200).send({
      success: true,
      data: types
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateService = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const getTheType = await Services.findOne({
        where: { id }
      });
      if (!getTheType) {
        return res.status(404).send({
          success: false,
          message: "Invalid service"
        });
      }
      await Services.update(
        req.body,
        {
          where: { id },
          transaction: t
        }
      );
      return res.status(200).send({
        success: true,
        message: "Service updated"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteServices = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { id } = req.params;
      const getTheType = await Services.findOne({
        where: { id }
      });
      if (!getTheType) {
        return res.status(404).send({
          success: false,
          message: "Invalid Services"
        });
      }
      await Services.destroy({ where: { id }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Service deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
