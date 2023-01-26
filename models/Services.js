const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Services = sequelise.define(
  "services",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

module.exports = Services;
