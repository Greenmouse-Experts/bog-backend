'use strict';

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Fees = sequelise.define(
  "fees",
  {
    id: {
      allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    amount: {
      type: Sequelize.DOUBLE,
      allowNull: true
    }
  }
);

module.exports = Fees;
