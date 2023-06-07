const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Project = require("./Project");

const ProjectBidding = sequelise.define(
  "project_biddings",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    userId: {
      allowNull: true,
      type: Sequelize.UUID,
    },
    projectId: {
      allowNull: true,
      type: Sequelize.UUID,
    },
    projectCost: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "pending",
      allowNull: true,
    },
    deliveryTimeLine: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    areYouInterested: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    reasonOfInterest: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { paranoid: true }
);

Project.hasMany(ProjectBidding, {
  foreignKey: "projectId",
  as: "bids"
});

ProjectBidding.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
});

module.exports = ProjectBidding;
