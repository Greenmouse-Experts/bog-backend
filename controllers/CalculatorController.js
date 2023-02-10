/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const sequelize = require("../config/database/connection");
const SmartCalculatorSetting = require("../models/SmartCalculatorSetting");

exports.createRate = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name } = req.body;
      const getRate = await SmartCalculatorSetting.findOne({
        where: { name }
      });
      if (getRate) {
        return res.status(200).send({
          success: false,
          message: "Name already existed"
        });
      }
      const allSettings = await SmartCalculatorSetting.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: allSettings
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.ReadRate = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const getRates = await SmartCalculatorSetting.findAll();

      return res.status(200).send({
        success: true,
        data: getRates
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.UpdateRate = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { id } = req.params;
      const getRate = await SmartCalculatorSetting.findOne({
        where: { id }
      });
      if (!getRate) {
        return res.status(501).send({
          success: false,
          message: "Already deleted"
        });
      }
      const updatedSetting = await SmartCalculatorSetting.update(req.body, {
        where: { id },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: updatedSetting
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.DeleteRate = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { id } = req.params;
      const getRate = await SmartCalculatorSetting.findOne({
        where: { id }
      });
      if (!getRate) {
        return res.status(501).send({
          success: false,
          message: "Already deleted"
        });
      }
      await SmartCalculatorSetting.destroy({
        where: { id },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Deleted successfully"
      });
    } catch (error) {
      return next(error);
    }
  });
};
