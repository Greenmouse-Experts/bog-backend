const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const BuildingProject = require("./BuildingProject");
const ContractorProject = require("./ContractorProject");
const DrawingProject = require("./DrawingProject");
const LandSurveyProject = require("./LandSurveyProject");
const User = require("./User");

const Project = sequelise.define(
  "projects",
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
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    projectTypes: {
      allowNull: false,
      type: Sequelize.ENUM,
      values: [
        "land_survey",
        "construction_drawing",
        "building_approval",
        "geotechnical_investigation",
        "contractor"
      ]
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

User.hasMany(Project, {
  foreignKey: "userId",
  as: "projects",
  onDelete: "cascade",
  hooks: true
});

Project.hasMany(LandSurveyProject, {
  foreignKey: "projectId",
  as: "survey_project",
  onDelete: "cascade",
  hooks: true
});

Project.hasMany(ContractorProject, {
  foreignKey: "projectId",
  as: "contractor_project",
  onDelete: "cascade",
  hooks: true
});

Project.hasMany(DrawingProject, {
  foreignKey: "projectId",
  as: "drawing_project",
  onDelete: "cascade",
  hooks: true
});

Project.hasMany(BuildingProject, {
  foreignKey: "projectId",
  as: "building_project",
  onDelete: "cascade",
  hooks: true
});

module.exports = Project;
