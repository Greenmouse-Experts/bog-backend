'use strict';

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User")

const Addresses = sequelise.define(
  "addresses",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING
    },
    address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    state: {
      allowNull: true,
      type: Sequelize.STRING
    },
    country: {
      allowNull: true,
      type: Sequelize.STRING
    },
    longitude: {
      allowNull: true,
      type: Sequelize.FLOAT
    },
    latitude: {
      allowNull: true,
      type: Sequelize.FLOAT
    },
    zipcode: {
      allowNull: true,
      type: Sequelize.STRING
    },
    charge: {
      allowNull: true,
      type: Sequelize.FLOAT
    },
    delivery_type: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    }
  },
  { paranoid: true }
);

module.exports = Addresses;
