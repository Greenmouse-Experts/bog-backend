const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const LandSurveyProject = sequelise.define(
  "land_survey_projects",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    projectId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    propertyName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    propertyLocation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    propertyLga: {
      type: Sequelize.STRING,
      allowNull: true
    },
    landSize: {
      type: Sequelize.STRING,
      allowNull: true
    },
    propertyType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    surveyType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["pending", "approved", "ongoing", "cancelled", "completed"],
      defaultValue: "pending"
    }
  },
  { paranoid: true }
);

User.hasMany(LandSurveyProject, {
  foreignKey: "userId",
  as: "survey_project"
});

module.exports = LandSurveyProject;
