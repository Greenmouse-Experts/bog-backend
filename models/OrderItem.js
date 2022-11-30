const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const OrderItem = sequelise.define(
  "order_items",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    orderId: {
      type: Sequelize.UUID,
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
        const data = this.getDataValue("shippingAddress")
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
    discount: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    amount: {
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
    paymentDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    dueDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    returnDate: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  { paranoid: true }
);

OrderItem.belongsTo(User, {
  foreignKey: "ownerId",
  as: "user"
});

OrderItem.belongsTo(User, {
  foreignKey: "productOwner",
  as: "product_owner"
});

module.exports = OrderItem;
