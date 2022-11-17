const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
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
    orderId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    trackingId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: [
        "paid",
        "awaiting_shipment",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "declined",
        "completed"
      ]
    },
    ownerId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    productOwner: {
      type: Sequelize.UUID,
      allowNull: true
    },
    shippingAddress: {
      allowNull: true,
      type: Sequelize.TEXT,
      get() {
        const data = this.getDataValue("shippingAddress");
        return JSON.parse(data);
      },
      set(value) {
        this.setDataValue("shippingAddress", JSON.stringify(value));
      }
    },
    product: {
      allowNull: true,
      type: Sequelize.TEXT,
      get() {
        const data = this.getDataValue("product");
        return JSON.parse(data);
      },
      set(value) {
        this.setDataValue("product", JSON.stringify(value));
      }
    },
    paymentInfo: {
      allowNull: true,
      type: Sequelize.TEXT,
      get() {
        const data = this.getDataValue("paymentInfo");
        return JSON.parse(data);
      },
      set(value) {
        this.setDataValue("paymentInfo", JSON.stringify(value));
      }
    },
    quantity: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: true
    }
  },
  { paranoid: true }
);

Order.belongsTo(User, {
  foreignKey: "ownerId",
  as: "user"
});

Order.belongsTo(User, {
  foreignKey: "productOwner",
  as: "product_owner"
});

module.exports = Order;
