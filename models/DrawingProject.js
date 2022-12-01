const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const DrawingProject = sequelise.define(
  "constructor_drawing_projects",
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
    }
  },
  { paranoid: true }
);

User.hasMany(DrawingProject, {
  foreignKey: "userId",
  as: "drawings"
});

module.exports = DrawingProject;
