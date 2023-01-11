const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycSupplyCategory = sequelise.define(
  "kyc_supply_categories",
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
    categories: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycSupplyCategory;
