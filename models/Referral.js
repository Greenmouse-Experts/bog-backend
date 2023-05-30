const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Referral = sequelise.define(
  "referrals",
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
    referredId: {
      allowNull: true,
      type: Sequelize.UUID
    }
  },
  { paranoid: true }
);

module.exports = Referral;
