/* eslint-disable no-unused-vars */
const Notification = require("../models/Notification");
const NotificationService = require("../helpers/notification");
const sequelize = require("../config/database/connection");

exports.getAllAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        type: "admin"
      },
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: notifications
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllAUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        type: "user",
        userId: req.params.userId
      },
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: notifications
    });
  } catch (error) {
    return next(error);
  }
};

exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const data = {
      status: "read",
      isRead: true
    };
    const notification = await Notification.findByPk(req.params.notificationId);
    if (!notification) {
      return res.status(200).send({
        success: true,
        message: "Notification mark as read"
      });
    }
    await Notification.update(data, {
      where: { id: req.params.notificationId }
    });
    const { io } = req.app;
    if (notification.type === "admin") {
      io.emit(
        "getNotifications",
        await NotificationService.fetchAdminNotification()
      );
    } else if (notification.type === "user") {
      io.emit(
        "getNotifications",
        await NotificationService.fetchUserNotificationApi({
          userId: notification.userId
        })
      );
    }

    return res.status(200).send({
      success: true,
      message: "Notification mark as read"
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { notificationId } = req.params;
      await NotificationService.deleteNotifications(notificationId);
      return res.status(200).send({
        success: true,
        message: "Notification deleted"
      });
    } catch (error) {
      return next(error);
    }
  });
};
