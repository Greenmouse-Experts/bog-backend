const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycYearsExperience = sequelise.define(
  "kyc_years_of_experiences",
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
    years_of_experience: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_involvement: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycYearsExperience;
