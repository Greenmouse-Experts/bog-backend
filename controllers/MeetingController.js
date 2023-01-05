/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const helper = require("../helpers/utility");
const MeetingModel = require("../models/Meeting");
const MeetingInfoModel = require("../models/MeetingInfo");
const { zoomGenerator } = require("../service/zoomService");

exports.myMeeting = async (req, res, next) => {
  try {
    const where = {
      requestId: req.params.userId
    };

    const meetings = await MeetingModel.findAll({ where });

    return res.status(200).send({
      success: true,
      data: meetings
    });
  } catch (error) {
    return next(error);
  }
};

exports.createMeeting = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      console.log(req.body);
      const meetingData = {
        ...req.body,
        meetingSlug: `MET-${helper.generateOrderId}`
      };

      const myMeetings = await MeetingModel.create(meetingData, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: myMeetings
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.meetingAction = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { meetingId, status } = req.body;
      const myMeeting = await MeetingModel.findOne({
        where: { id: meetingId }
      });
      if (!myMeeting) {
        return res.status(404).send({
          success: false,
          message: "Invalid Meeting"
        });
      }
      let start_url = "-";
      if (status === "approved") {
        const zoomInfo = await zoomGenerator(myMeeting.requestEmail);
        if (!zoomInfo) {
          return res.status(501).send({
            success: false,
            data: "Unable to generate zoom link"
          });
        }
        const meetData = { ...zoomInfo, meetingId };
        await MeetingInfoModel.create(meetData, {
          transaction: t
        });
        start_url = zoomInfo.start_url;
      }

      const updated = await MeetingModel.update(
        { approval_status: status, start_url, status: "placed" },
        {
          where: { id: meetingId },
          transaction: t
        }
      );
      return res.status(200).send({
        success: true,
        message: "Meeting updated successfully",
        data: updated
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllMeeting = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const allMyMeeting = await MeetingModel.findAll();

      return res.status(200).send({
        success: true,
        data: allMyMeeting
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.deleteMeeting = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { meetingId } = req.params;
      const myMeeting = await MeetingModel.findOne({
        where: { id: meetingId }
      });
      if (!myMeeting) {
        return res.status(404).send({
          success: false,
          message: "Invalid meeting"
        });
      }
      await MeetingModel.destroy({ where: { id: meetingId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Meeting deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
