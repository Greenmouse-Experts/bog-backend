const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const OrderItem = require("./OrderItem");
const User = require("./User");

const Order = sequelise.define(
  "orders",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    orderSlug: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    discount: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    deliveryFee: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["pending", "approved", "cancelled", "completed"],
      defaultValue: "pending"
    }
  },
  { paranoid: true }
);

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "order_items"
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "user_orders"
});

module.exports = Order;
