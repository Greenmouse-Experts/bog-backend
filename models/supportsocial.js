const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const SupportSocial = sequelise.define(
  "supportsocials",
  {
    whatsapp: {
      allowNull: true,
      type: Sequelize.JSON
    },
    twitter: {
      allowNull: true,
      type: Sequelize.JSON
    }
  },
  {
    paranoid: false,
    tableName: "supportsocials"
  }
);

module.exports = SupportSocial;
