/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const moment = require("moment");
const sequelize = require("../config/database/connection");
const AdminMessage = require("../models/AdminMessage");

exports.postAnnouncement = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { date, title, content, user } = req.body;

      const request = {
        expiredAt: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        content,
        title,
        user
      };
      if (req.file) {
        const url = `${process.env.APP_URL}/${req.file.path}`;
        request.supportingDocument = url;
      }

      const data = await AdminMessage.create(request, { transaction: t });
      return res.status(201).send({
        success: true,
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.viewAnnouncements = async (req, res, next) => {
  try {
    const messages = await AdminMessage.findAll({
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: messages
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { id } = req.params;
      await AdminMessage.destroy({ where: { id }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Announcement deleted Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.allAdminMessages = async (req, res, next) => {
  try {
    const { userType } = req.query;
    const where = {
      expiredAt: {
        [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss")
      },
      [Op.or]: [{ user: "all" }, { user: userType }]
    };

    const messages = await AdminMessage.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });
    console.log(messages)
    return res.status(200).send({
      success: true,
      data: messages
    });
  } catch (error) {
    return next(error);
  }
};
