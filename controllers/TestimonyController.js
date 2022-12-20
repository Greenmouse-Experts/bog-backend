/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Testimony = require("../models/Testimonies");

exports.CreateTestimony = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      if (req.file) {
        const url = `${process.env.APP_URL}/${req.file.path}`;
        req.body.image = url;
      }
      const testimony = await Testimony.create(req.body, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: testimony
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getTestimonies = async (req, res, next) => {
  try {
    const testimony = await Testimony.findAll();
    return res.status(200).send({
      success: true,
      data: testimony
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateIsHomepage = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { testimonyId } = req.params;
      const getTestimony = await Testimony.findOne({
        where: { id: testimonyId }
      });
      if (!getTestimony) {
        return res.status(404).send({
          success: false,
          message: "Testimony Not Found"
        });
      }

      await Testimony.update(
        { isHomepage: !getTestimony.isHomepage },
        {
          where: { id: testimonyId },
          transaction: t
        }
      );
      return res.status(200).send({
        success: true,
        data: getTestimony
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.updateTestimony = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { testimonyId, isHomePage, ...update } = req.body;
      const getTestimony = await Testimony.findOne({
        where: { id: testimonyId }
      });
      if (!getTestimony) {
        return res.status(404).send({
          success: false,
          message: "Testimony Not Found"
        });
      }
      await Testimony.update(update, {
        where: { id: testimonyId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: getTestimony
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteTestimony = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { testimonyId } = req.params;
      const getTestimony = await Testimony.findOne({
        where: { id: testimonyId }
      });
      if (!getTestimony) {
        return res.status(404).send({
          success: false,
          message: "Testimony Not Found"
        });
      }
      await Testimony.destroy({ where: { id: testimonyId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Testimony deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
