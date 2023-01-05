const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Meeting = sequelise.define(
  "meetings",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    projectSlug: {
      type: Sequelize.STRING,
      allowNull: true
    },
    meetingSlug: {
      type: Sequelize.STRING,
      allowNull: true
    },
    requestId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    requestEmail: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: "pending",
      values: ["pending", "placed", "ongoing", "attended", "cancelled"]
    },
    approval_status: {
      type: Sequelize.ENUM,
      defaultValue: "pending",
      values: ["pending", "approved", "declined"]
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    time: {
      type: Sequelize.TIME,
      allowNull: true
    },
    start_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    join_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    recording: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

// Meeting.hasMany(MeetingInfo, {
//   foreignKey: "meetingId",
//   as: "mymeeting"
// });

// MeetingInfo.belongsTo(Meeting, {
//   foreignKey: "meetingId",
//   as: "meetings"
// });

module.exports = Meeting;
