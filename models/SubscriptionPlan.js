const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const SubscriptionPlan = sequelise.define(
  "subscription_plans",
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
    duration: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    amount: {
      allowNull: true,
      type: Sequelize.FLOAT
    }
  },
  { paranoid: true }
);

module.exports = SubscriptionPlan;
