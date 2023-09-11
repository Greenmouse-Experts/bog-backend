const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");


const job_roles = [
  'quantity_surveyor',
  'structural_engineer',
  'architects',
  'mechanical_engineer',
  'electrical_engineer',
  'surveyor',
  'civil_engineer'
]

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
    registration_number: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    business_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.ENUM,
      values: job_roles,
      allowNull: true
    },
    operational_address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    years_of_experience: {
      type: Sequelize.STRING,
      allowNull: true
    },
    certification_of_personnel:{
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycGeneralInfo;
