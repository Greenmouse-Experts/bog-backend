const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Order = require("./Order");

const ProductReview = sequelise.define(
  "reviews",
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
    productId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    star: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    review: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

Order.hasOne(ProductReview, {
  foreignKey: "productId",
  as: "review",
  onDelete: "cascade",
  hooks: true
});

module.exports = ProductReview;
