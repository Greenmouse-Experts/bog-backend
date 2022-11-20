const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ProductImage = sequelise.define(
  "product_images",
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
    productId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    creatorId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    },
    url: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

module.exports = ProductImage;
