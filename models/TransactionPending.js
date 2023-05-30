const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const TransactionPending = sequelise.define(
  "pendingtransaction",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    TransactionId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    superadmin: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    financialadmin: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    transaction: {
      allowNull: true,
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("transaction") !== undefined) {
          return JSON.parse(this.getDataValue("transaction"));
        }
      },
      set(value) {
        this.setDataValue("transaction", JSON.stringify(value));
      },
    },
    transfer: {
      allowNull: true,
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("transfer") !== undefined) {
          return JSON.parse(this.getDataValue("transfer"));
        }
      },
      set(value) {
        this.setDataValue("transfer", JSON.stringify(value));
      },
    },
  },
  { paranoid: true }
);

User.hasMany(TransactionPending, {
  foreignKey: "userId",
  as: "pendingtransactions",
});

TransactionPending.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = TransactionPending;
