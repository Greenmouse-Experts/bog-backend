const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ProductPartner = sequelise.define(
  "product_partners",
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
      defaultValue: "product_partner"
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    company_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_street: {
      type: Sequelize.STRING,
      allowNull: true
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cac_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tin: {
      type: Sequelize.STRING,
      allowNull: true
    },
    years_of_experience: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    certificate_of_operation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    professional_certificate: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = ProductPartner;
