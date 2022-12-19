const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Transaction = sequelise.define(
  "transactions",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    TransactionId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    paymentReference: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = Transaction;
