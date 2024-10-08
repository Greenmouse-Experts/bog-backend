/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const { Op } = require('sequelize');
const sequelize = require('../config/database/connection');
const helper = require('../helpers/utility');
const MeetingModel = require('../models/Meeting');
const ProjectModel = require('../models/Project');
const MeetingInfoModel = require('../models/MeetingInfo');
const { zoomGenerator } = require('../service/zoomService');
const Notification = require('../helpers/notification');
const User = require('../models/User');
const { getUserTypeProfile } = require('../service/UserService');
const Project = require('../models/Project');

exports.myMeeting = async (req, res, next) => {
  try {
    const { status } = req.query;

    const userId = req.user.id;
    const { userType } = req.query;
    const profile = await getUserTypeProfile(userType, userId);

    if (!profile) {
      throw new Error('Profile not found.');
    }
    const where = {
      userId: profile.id,
    };
    if (status) {
      where.approval_status = status;
    }

    const meetings = await MeetingModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MeetingInfoModel,
          as: 'meeting_info',
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: meetings,
    });
  } catch (error) {
    return next(error);
  }
};

exports.viewMeetingPage = async (req, res, next) => {
  try {
    console.log(req);
  } catch (error) {
    next(error);
  }
};

exports.servicePartnerMeetings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userType, status } = req.query;
    const profile = await getUserTypeProfile(userType, userId);

    const whereProject = { serviceProviderId: profile.id };
    const projects = await Project.findAll({
      where: whereProject,
      order: [['createdAt', 'DESC']],
    });

    const projectSlugs = projects.map((proj) => proj.projectSlug);

    const where = {
      [Op.or]: [{ userId: profile.id }, { projectSlug: projectSlugs }],
    };

    if (status) {
      where.approval_status = status;
    }

    const meetings = await MeetingModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MeetingInfoModel,
          as: 'meeting_info',
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: meetings,
    });
  } catch (error) {
    return next(error);
  }
};

exports.createMeeting = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType, projectSlug, date, time } = req.body;
      const userId = req.user.id;
      const project = await ProjectModel.findOne({
        where: { projectSlug },
      });
      const type = helper.projectSlug(project.projectTypes);
      const meetingData = {
        ...req.body,
        meetingSlug: `BOG/MET/${type}/${Math.floor(
          190000000 + Math.random() * 990000000
        )}`,
      };
      if (userType !== 'admin') {
        const profile = await getUserTypeProfile(userType, userId);
        meetingData.userId = profile.id;
      }

      // Verify
      await this.verifyMeeting(date, time);

      const myMeetings = await MeetingModel.create(meetingData, {
        transaction: t,
      });
      const user = await User.findByPk(req.user.id, {
        attributes: ['email', 'name', 'fname', 'lname'],
      });

      const mesg = `${user.fname} ${user.lname} requested for a meeting on project`;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      return res.status(200).send({
        success: true,
        data: myMeetings,
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.verifyMeeting = async (date, time) => {
  if (new Date(`${date} ${time}`).getTime() < new Date().getTime()) {
    throw new Error('Meeting time cannot be lesser than the current date');
  }

  // Check meeting date and time
  const meetingPeriod = await MeetingModel.findOne({
    where: {
      date: {
        [Op.eq]: new Date(date),
      },
      time,
    },
  });

  if (meetingPeriod) {
    throw new Error('Meeting has already been scheduled for this time');
  }
};

exports.updateMeeting = async (req, res, next) => {
  try {
    const { id: userId } = req._credentials;
    const { id: meetingId } = req.params;

    const { userType, projectSlug, date, time } = req.body;

    // Check meeting
    const meeting = await MeetingModel.findOne({
      where: { id: meetingId, userId },
    });

    // Verify
    if (date && time) {
      await this.verifyMeeting(date, time);
    }

    // Update
    await MeetingModel.update(req.body, { where: { id: meetingId } });

    return res.status(200).send({
      success: true,
      message: 'Meeting updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

exports.meetingAction = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { meetingId, status } = req.body;
      const myMeeting = await MeetingModel.findOne({
        where: { id: meetingId },
      });
      if (!myMeeting) {
        return res.status(404).send({
          success: false,
          message: 'Invalid Meeting',
        });
      }
      const project = await ProjectModel.findOne({
        where: { projectSlug: myMeeting.projectSlug },
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: 'Project not found.',
        });
      }

      let start_url = '';
      const topic = project.title ? project.title : myMeeting.projectSlug;
      if (status === 'approved') {
        const zoomInfo = await zoomGenerator(process.env.ADMIN_EMAIL, topic);
        if (!zoomInfo) {
          return res.status(501).send({
            success: false,
            data: 'Unable to generate zoom link',
          });
        }
        const meetData = { ...zoomInfo, meetingId };
        await MeetingInfoModel.create(meetData, {
          transaction: t,
        });
        start_url = zoomInfo.start_url;

        const mesg = `Your meeting request has been approved`;
        const { userId } = project;
        const notifyType = 'user';
        const { io } = req.app;
        await Notification.createNotification({
          type: notifyType,
          message: mesg,
          userId,
        });
        io.emit(
          'getNotifications',
          await Notification.fetchUserNotificationApi({ userId })
        );
      }
      const meetingStatus = start_url !== '' ? 'placed' : 'cancelled';
      const updated = await MeetingModel.update(
        { approval_status: status, start_url, status: meetingStatus },
        {
          where: { id: meetingId },
          transaction: t,
        }
      );
      return res.status(200).send({
        success: true,
        message: 'Meeting updated successfully',
        data: updated,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllMeeting = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { status } = req.query;
      const where = {};

      if (status) {
        where.approval_status = status;
      }

      const allMyMeeting = await MeetingModel.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: MeetingInfoModel,
            as: 'meeting_info',
          },
        ],
      });

      return res.status(200).send({
        success: true,
        data: allMyMeeting,
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.deleteMeeting = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { meetingId } = req.params;
      const myMeeting = await MeetingModel.findOne({
        where: { id: meetingId },
      });
      if (!myMeeting) {
        return res.status(404).send({
          success: false,
          message: 'Invalid meeting',
        });
      }
      await MeetingModel.destroy({ where: { id: meetingId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: 'Meeting deleted successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
