const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ContactDetails = sequelise.define(
  "contact_details",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    orderId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    contact_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contact_email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contact_phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true
    },
    postal_code: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = ContactDetails;
