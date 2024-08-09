const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycFinancialData = sequelise.define(
  "kyc_financial_infos",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      // i.e profileId,
      type: Sequelize.UUID,
      allowNull: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bank_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    banker_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    account_type: {
      type: Sequelize.ENUM,
      values: ["savings", "current"],
      allowNull: true
    },
    overdraft_facility: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycFinancialData;
