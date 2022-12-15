const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Order = sequelise.define(
  "testimonies",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    message: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isHomepage: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    star: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = Order;
