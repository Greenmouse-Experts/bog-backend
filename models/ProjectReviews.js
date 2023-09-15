'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project_reviews.init({
    star: DataTypes.DOUBLE,
    review: DataTypes.STRING,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'project_reviews',
  });
  return project_reviews;
};

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Project = require('./Project');
const User = require("./User")

const ProjectReviews = sequelise.define(
  "project_reviews",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    star: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    review: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    projectId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    serviceProviderId: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }
);

ProjectReviews.belongsTo(User, {
  foreignKey: "userId",
  as: "client"
})

ProjectReviews.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
})

User.hasMany(ProjectReviews, {
  foreignKey: "userId",
  as: "client"
})

module.exports = ProjectReviews;
