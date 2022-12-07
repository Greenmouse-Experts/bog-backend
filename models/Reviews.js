const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Product = require("./Product");
const Partner = require("./ServicePartner");

const productReview = sequelise.define(
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

Product.hasMany(productReview, {
    foreignKey: "productId",
    as: "product_reviews",
    onDelete: "cascade",
    hooks: true
});


const partnerReview = sequelise.define(
  "service_reviews",
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
    partnerId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    review: {
        allowNull: true,
        type: Sequelize.STRING,
    }
  },
  { paranoid: true }
);

Partner.hasMany(partnerReview, {
    foreignKey: "id",
    as: "partner_reviews",
    onDelete: "cascade",
    hooks: true
});


module.exports = { productReview, partnerReview };
