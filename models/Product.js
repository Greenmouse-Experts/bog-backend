const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

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
    }
  },
  { paranoid: true }
);

module.exports = Product;
