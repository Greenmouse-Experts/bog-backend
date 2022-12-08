const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const PrivateClient = sequelise.define(
  "private_clients",
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
    userType: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "private_client"
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  },
  { paranoid: true }
);

module.exports = PrivateClient;
