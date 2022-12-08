const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const UserConnector = sequelise.define(
  "user_connectors",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    connector_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    client_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    client_secret: {
      type: Sequelize.STRING,
      allowNull: true
    },
    exchange_key: {
      type: Sequelize.STRING,
      allowNull: true
    },
    access_token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    refresh_token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    credentials: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    expires_in: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = UserConnector;
