/* eslint-disable no-unused-vars */
const Notification = require("../models/Notification");

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
