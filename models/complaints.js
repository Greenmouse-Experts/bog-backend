'use strict';

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Complaints = sequelise.define(
  "complaints",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    issue_no: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    user_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    issue_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true
    },
    response_note: {
      type: Sequelize.STRING,
      allowNull: true
    },
  },
  // { paranoid: true }
);

module.exports = Complaints;
