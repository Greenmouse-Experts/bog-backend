const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const SupportSocial = sequelise.define(
  "support_socials",
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
    tableName: "support_socials"
  }
);

module.exports = SupportSocial;
