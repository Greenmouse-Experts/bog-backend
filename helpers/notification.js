const Sequelize = require("sequelize");
const { Op } = require("sequelize");

// local imports
const Users = require("../models/User");
const Notification = require("../models/Notification");

exports.createNotification = async ({ userId, type, message }) => {
  try {
    const request = {
      userId,
      type,
      message
    };
    await Notification.create(request);
    console.log("Notification sent");
    return true;
  } catch (error) {
    return error;
  }
};

exports.fetchUserNotification = async ({ userId }) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        userId,
        type: "user",
        [Op.or]: [{ status: "pending" }, { status: "unread" }]
      },
      order: [["createdAt", "DESC"]]
    });
    return notifications;
  } catch (error) {
    return error;
  }
};
exports.fetchUserNotificationApi = async notifyParam => {
  try {
    const { userId } = notifyParam;
    const notifications = await Notification.findAll({
      where: {
        userId,
        type: "user",
        [Op.or]: [{ status: "pending" }, { status: "unread" }]
      },
      order: [["createdAt", "DESC"]]
    });
    return notifications;
  } catch (error) {
    return error;
  }
};

exports.fetchAdminNotification = async () => {
  try {
    const notifications = await Notification.findAll({
      where: {
        type: "admin",
        [Op.or]: [{ status: "pending" }, { status: "unread" }]
      },
      order: [["createdAt", "DESC"]]
    });
    console.log(JSON.parse(JSON.stringify(notifications)));
    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    return error;
  }
};

exports.updateNotification = async id => {
  try {
    await Notification.update(
      { isRead: true, status: "read" },
      { where: { id } }
    );
    return true;
  } catch (error) {
    return error;
  }
};

exports.deleteNotifications = async id => {
  try {
    await Notification.destroy({ where: { id } });
    return true;
  } catch (error) {
    return error;
  }
};
