const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycTaxPermit = sequelise.define(
  "kyc_tax_permits",
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
    VAT: {
      type: Sequelize.STRING,
      allowNull: true
    },
    TIN: {
      type: Sequelize.STRING,
      allowNull: true
    },
    relevant_statutory: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycTaxPermit;
