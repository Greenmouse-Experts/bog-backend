const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ProjectBidding = sequelise.define(
  "project_biddings",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    projectId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    projectCost: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ["pending", "accepted", "rejected"]
    },
    deliveryTimeLine: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    areYouInterested: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    reasonOfInterest: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = ProjectBidding;
