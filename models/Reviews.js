const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Order = require("./Order");
const Products = require("./Product")
const User = require("./User")

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

// Order.hasOne(ProductReview, {
//   foreignKey: "productId",
//   as: "review",
//   onDelete: "cascade",
//   hooks: true
// });

ProductReview.belongsTo(User, {
  foreignKey: 'userId',
  as: 'client'
})

// ProductReview.belongsTo(Products, {
//   foreignKey: "productId",
//   as: "product_info"
// })

// ProductReview.belongsTo(Products, {
//   foreignKey: "productId",
//   as: "review",
//   onDelete: "cascade",
//   hooks: true
// })

// ProductReview.hasMany(Products, {
//   foreignKey: "productId",
//   as: "review",
// })

// Products.hasMany(ProductReview, {
//   foreignKey: "productId",
//   as: "review",
// })

module.exports = ProductReview;
