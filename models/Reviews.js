const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Product = require("./Product");
const Partner = require("./ServicePartner");

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
        type: Sequelize.STRING,
    }
  },
  { paranoid: true }
);

Product.hasMany(ProductReview, {
    foreignKey: "productId",
    as: "product_reviews",
    onDelete: "cascade",
    hooks: true
});

module.exports =  ProductReview;
