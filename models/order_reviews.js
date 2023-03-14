
const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Order = sequelise.define(
  "order_reviews",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    star: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    review: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    orderId: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }
);

module.exports = Order;
