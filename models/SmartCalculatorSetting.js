const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const SmartCalculatorSetting = sequelise.define(
  "smart_calculator_settings",
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
    },
    rate: {
      allowNull: true,
      type: Sequelize.FLOAT
    }
  },
  { paranoid: true }
);

module.exports = SmartCalculatorSetting;
