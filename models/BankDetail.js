const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

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
      allowNull: true,
      unique: true
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bank_name: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

User.hasOne(BankDetail, {
  foreignKey: "userId",
  as: "bank_detail",
  onDelete: "cascade",
  hooks: true
});

module.exports = BankDetail;
