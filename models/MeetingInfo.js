const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const MeetingInfo = sequelise.define(
  "meetings_infos",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    meetingId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    host_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    host_email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.TIME,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    join_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    pstn_password: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = MeetingInfo;
