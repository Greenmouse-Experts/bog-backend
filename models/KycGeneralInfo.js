const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycGeneralInfo = sequelise.define(
  "kyc_general_informations",
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
    organisation_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contact_number: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    reg_type: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["Incorporation", "Registered Business Name"]
    },
    business_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    operational_address: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

module.exports = KycGeneralInfo;
