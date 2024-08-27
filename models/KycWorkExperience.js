const Sequelize = require('sequelize');
const sequelise = require('../config/database/connection');

const KycJobExperience = sequelise.define(
  'kyc_work_experiences',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    userType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    userId: {
      // i.e profileId,
      type: Sequelize.UUID,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    fileUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    years_of_experience: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    company_involvement: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { paranoid: true }
);

module.exports = KycJobExperience;
//
// kyc_category_of_supply
// kyc_documents
// kyc_financial_data
// kyc_general_info
// kyc_organisation_info
// kyc_tax_permits
// kyc_work_experience
