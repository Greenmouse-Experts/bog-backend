const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ServicesFormBuilder = require("./ServicesFormBuilder");
const User = require("./User");
const Project = require("./Project");

const ServicesFormProjects = sequelise.define(
  "ServiceFormProjects",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    userID: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    projectID: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    serviceFormID: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    value: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    status: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  }
  // { paranoid: true }
);

User.hasMany(ServicesFormProjects, {
  foreignKey: "userID",
  as: "user",
  onDelete: "cascade",
  hooks: true,
});

Project.hasMany(ServicesFormProjects, {
  foreignKey: "projectID",
  as: "project",
  onDelete: "cascade",
  hooks: true,
});

ServicesFormBuilder.hasMany(ServicesFormProjects, {
  foreignKey: "serviceFormID",
  as: "serviceForm",
  onDelete: "cascade",
  hooks: true,
});

ServicesFormProjects.belongsTo(ServicesFormBuilder, {
  foreignKey: "serviceFormID",
  as: "serviceForm",
});

module.exports = ServicesFormProjects;
