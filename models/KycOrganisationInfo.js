const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const KycOrganisationInfo = sequelise.define(
  "kyc_organisation_informations",
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
    organisation_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    others: {
      type: Sequelize.STRING,
      allowNull: true
    },
    Incorporation_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    director_fullname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    director_designation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    director_phone: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    director_email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contact_phone: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    contact_email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    others_operations: {
      type: Sequelize.STRING,
      allowNull: true
    },
    no_of_staff: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cost_of_projects_completed: {
      type: Sequelize.STRING,
      allowNull: true
    },
    complexity_of_projects_completed: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = KycOrganisationInfo;
