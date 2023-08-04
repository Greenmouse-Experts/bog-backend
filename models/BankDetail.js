const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const BankDetail = sequelise.define(
  "bank_details",
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
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bank_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bank_code: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = BankDetail;
