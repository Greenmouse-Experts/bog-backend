const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ServiceProvider = sequelise.define(
  "service_providers",
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
    estimatedCost: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ["pending", "accepted", "rejected"]
    }
  },
  { paranoid: true }
);

module.exports = ServiceProvider;
