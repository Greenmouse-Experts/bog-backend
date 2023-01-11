const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycDocuments = sequelise.define(
  "kyc_documents",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      // i.e profileId,
      type: Sequelize.UUID,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    file: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycDocuments;
