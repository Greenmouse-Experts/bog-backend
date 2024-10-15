/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const { Op } = require('sequelize');
const moment = require('moment');
const sequelize = require('../config/database/connection');
const AdminMessage = require('../models/AdminMessage');
const Notifications = require('../models/Notification');
const {
  createNotification,
  createNotificationWithUserType,
} = require('../helpers/notification');
const { postMessageEmail } = require('../helpers/mailer/samples');
const jobQueue = require('../job');
const User = require('../models/User');

exports.postAnnouncement = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { date, title, content, user, drafted } = req.body;

      const request = {
        expiredAt: moment(date).format('YYYY-MM-DD HH:mm:ss'),
        content,
        title,
        user,
        drafted,
        emailSent: false,
      };

      if (req.file) {
        const url = `${process.env.APP_URL}/${req.file.path}`;
        request.supportingDocument = url;
      }

      const data = await AdminMessage.create(request, { transaction: t });

      if (drafted) {
        // Send in-app notification
        await createNotificationWithUserType({
          type: 'user',
          userType: user === 'all' ? null : user,
          message: `A message has been sent to you from the admin: ${content}`,
        });

        // Send / Add to queue
        // await jobQueue.now('instantJob', req.body);
      }

      return res.status(201).send({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    // Check announcement
    const announcement = await AdminMessage.findOne({
      where: { id: messageId },
    });

    if (!announcement) {
      throw new Error('Message is not available');
    }

    if ('drafted' in req.body) {
      req.body.drafted = Boolean(Number(req.body.drafted));
    }

    // Update
    await AdminMessage.update(req.body, { where: { id: messageId } });

    if ('drafted' in req.body) {
      // Send in-app notification
      await createNotificationWithUserType({
        type: 'user',
        userType: announcement.user === 'all' ? null : announcement.user,
        message: `A message has been sent to you from the admin: ${req.body.content}`,
      });
    }

    return res.send({
      success: true,
      message: 'Message updated successfully.',
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.viewAnnouncements = async (req, res, next) => {
  try {
    const messages = await AdminMessage.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).send({
      success: true,
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.params;
      await AdminMessage.destroy({ where: { id }, transaction: t });
      return res.status(200).send({
        success: true,
        message: 'Announcement deleted Successfully',
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
      [Op.or]: [
        {
          expiredAt: {
            [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        { expiredAt: null },
        { expiredAt: '0000-00-00 00:00:00' },
      ],
      [Op.and]: {
        [Op.or]: [{ user: 'all' }, { user: userType }],
      },
      [Op.and]: {
        drafted: false,
      },
    };

    const messages = await AdminMessage.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).send({
      success: true,
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
};

exports.draftedAdminMessages = async (req, res, next) => {
  try {
    const { userType } = req.query;
    const where = {
      [Op.or]: [
        {
          expiredAt: {
            [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        { expiredAt: null },
        { expiredAt: '0000-00-00 00:00:00' },
      ],
      [Op.and]: {
        [Op.or]: [{ user: 'all' }, { user: userType }],
      },
      [Op.and]: {
        drafted: 1,
      },
    };

    const messages = await AdminMessage.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).send({
      success: true,
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Mark message as read
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req._credentials;

    const { messageId } = req.params;

    // Get message details
    const messageDetails = await AdminMessage.findOne({
      where: { id: messageId },
    });

    if (!messageDetails) {
      throw new Error('Message not found.');
    }

    let updatedUnreadData = null;
    if (messageDetails.unread) {
      const unreadData = JSON.parse(messageDetails.unread);

      // Check if user has marked this message as read
      const _markedAsRead = unreadData.filter((userId) => userId === id);
      if (_markedAsRead.length) {
        throw new Error('Message has been marked as read.');
      }

      unreadData.push(id);
      updatedUnreadData = unreadData;
    } else {
      updatedUnreadData = [id];
    }

    // mark message as read for this user
    messageDetails.unread = JSON.stringify(updatedUnreadData);
    await messageDetails.save();

    return res.status(200).send({
      success: true,
      message: 'Message marked as read successfully.',
    });
  } catch (error) {
    return next(error);
  }
};
