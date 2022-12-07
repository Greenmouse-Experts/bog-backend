const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Reviews = require("./Reviews");
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
  as: "survey_project"
});

User.hasMany(Reviews, {
  foreignKey: "userId",
  as: "my_reviews"
});

module.exports = Project;
