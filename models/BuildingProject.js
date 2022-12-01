const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const BuildingProject = sequelise.define(
  "building_projects",
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
    purpose: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isResidential: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    propertyType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    projectType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["pending", "approved", "ongoing", "cancelled", "completed"],
      defaultValue: "pending"
    },
    surveyPlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    structuralPlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    architecturalPlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    mechanicalPlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    electricalPlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    soilTestReport: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sitePlan: {
      type: Sequelize.STRING,
      allowNull: true
    },
    siteAnalysisReport: {
      type: Sequelize.STRING,
      allowNull: true
    },
    environmentImpactReport: {
      type: Sequelize.STRING,
      allowNull: true
    },
    clearanceCertificate: {
      type: Sequelize.STRING,
      allowNull: true
    },
    supervisorLetter: {
      type: Sequelize.STRING,
      allowNull: true
    },
    structuralCalculationSheet: {
      type: Sequelize.STRING,
      allowNull: true
    },
    deedOfAgreement: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

User.hasMany(BuildingProject, {
  foreignKey: "userId",
  as: "building"
});

module.exports = BuildingProject;
