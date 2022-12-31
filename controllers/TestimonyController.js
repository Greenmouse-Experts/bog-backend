/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Testimony = require("../models/Testimonies");
const User = require("../models/User");
const Notification = require("../helpers/notification");

exports.CreateTestimony = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: ["id", "name", "photo"]
      });
      const data = {
        ...req.body,
        name: user.name,
        image: user.photo,
        userId
      };
      const testimony = await Testimony.create(data, {
        transaction: t
      });

      // Notification
      const mesg = `${user.name} gave a testimony`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

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
    const testimony = await Testimony.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "photo", "userType"]
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: testimony
    });
  } catch (error) {
    return next(error);
  }
};

exports.getHompageTestimonies = async (req, res, next) => {
  try {
    const testimony = await Testimony.findAll({
      where: { isHomePage: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "photo", "userType"]
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: testimony
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUserTestimony = async (req, res, next) => {
  try {
    const testimony = await Testimony.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "photo", "userType"]
        }
      ]
    });
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
      if (getTestimony.isHomepage === false) {
        // Notification
        const { userId } = getTestimony;
        const mesg = `Your testimonial has been published to home page`;
        const notifyType = "user";
        const { io } = req.app;
        await Notification.createNotification({
          type: notifyType,
          message: mesg,
          userId
        });
        io.emit(
          "getNotifications",
          await Notification.fetchUserNotificationApi({ userId })
        );
      }
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
