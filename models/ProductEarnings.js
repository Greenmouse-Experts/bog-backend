const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ContactDetails = require("./ContactDetails");
const OrderItem = require("./OrderItem");
const User = require("./User");
const Order = require("./Order");

const ProductEarning = sequelise.define(
  "product_earning",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    orderId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    orderItemId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    productOwnerId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    qty: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["paid", "pending"],
      defaultValue: "pending",
    }
  },
  { paranoid: true }
);

Order.hasOne(ProductEarning, {
  foreignKey: "orderId",
  as: "productEarnings",
});

ProductEarning.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

// OrderItem.hasOne(ProductEarning, {
//   foreignKeys: "orderItemId",
//   as: "productEarnings",
// });

// ProductEarning.belongsTo(OrderItem, {
//   foreignKey: "orderItemId",
//   as: "order_items",
// });



User.hasMany(ProductEarning, {
  foreignKey: "productOwnerId",
  as: "userProductEarning",
});

ProductEarning.belongsTo(User, {
  foreignKey: "productOwnerId",
  as: "productOwner",
});




module.exports = ProductEarning;
