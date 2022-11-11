const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ProductCategory = require("./ProductCategory");
const ProductImage = require("./ProductImage");
const User = require("./User");

const Product = sequelise.define(
  "products",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    description: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    categoryId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    creatorId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    price: {
      allowNull: true,
      type: Sequelize.DECIMAL
    },
    quantity: {
      allowNull: true,
      type: Sequelize.DECIMAL
    },
    unit: {
      allowNull: true,
      type: Sequelize.STRING
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    },
    showInShop: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["draft", "pending", "in_review", "approved", "disapproved"],
      defaultValue: "pending"
    }
  },
  { paranoid: true }
);

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "product_image",
  onDelete: "cascade",
  hooks: true
});

Product.belongsTo(ProductCategory, {
  foreignKey: "categoryId",
  as: "category"
});

Product.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator"
});

User.hasMany(Product, {
  foreignKey: "creatorId",
  as: "products",
  onDelete: "cascade",
  hooks: true
});

module.exports = Product;
