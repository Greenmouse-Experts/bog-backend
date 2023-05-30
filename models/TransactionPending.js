const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const TransactionPending = sequelise.define(
  "transactions_pending",
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
    super_admin: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    financial_admin: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    transaction: {
      allowNull: true,
      type: Sequelize.TEXT,
      get() {
        const data = this.getDataValue("transaction");
        return JSON.parse(data);
      },
      set(value) {
        this.setDataValue("transaction", JSON.stringify(value));
      },
    },
  },
  { paranoid: true }
);

User.hasMany(TransactionPending, {
  foreignKey: "userId",
  as: "transactions_pending",
});

TransactionPending.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = TransactionPending;
