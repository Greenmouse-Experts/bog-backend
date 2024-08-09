const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const DeliveryAddresses = sequelise.define(
  "delivery_addresses",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    contact_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contact_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    delivery_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    home_address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    postal_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  { paranoid: true }
);

module.exports = DeliveryAddresses;
