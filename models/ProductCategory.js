const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ProductCategory = sequelise.define(
  "product_categories",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    description: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    unit: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    max_qty: {
      allowNull: true,
      type: Sequelize.NUMBER,
    },
    min_qty: {
      allowNull: true,
      type: Sequelize.NUMBER,
    },
  },
  { paranoid: true }
);

module.exports = ProductCategory;
