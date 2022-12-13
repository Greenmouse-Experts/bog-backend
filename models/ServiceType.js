const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ServiceType = sequelise.define(
  "service_types",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    title: {
      allowNull: true,
      type: Sequelize.UUID
    },
    description: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    slug: {
      allowNull: true,
      type: Sequelize.STRING
    },
  },
  { paranoid: true }
);

module.exports = ServiceType;
