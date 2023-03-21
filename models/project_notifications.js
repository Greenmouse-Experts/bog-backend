
const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ProjectNotifications = sequelise.define(
  "project_notifications",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    projectId: {
      allowNull: true,
      type: Sequelize.STRING
    },
    body: {
      allowNull: true,
      type: Sequelize.STRING
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    },
    serviceProviderID: {
      allowNull: true,
      type: Sequelize.STRING
    },
    by: {
      allowNull: true,
      type: Sequelize.ENUM(
        "admin",
        "service_partner"
      ),
    }
  }
);

module.exports = ProjectNotifications;


