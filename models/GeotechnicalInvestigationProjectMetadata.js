
const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const GeotechnicalInvestigationProjectMetadata = sequelise.define(
  "geotechnical_investigation_project_metadata",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    mobilization: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    demobilization: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_rig: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    depth_of_borehole: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_cpt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    tons_machine: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    chemical_analysis_of_ground_water: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    lab_test: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    report: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    lab_test_types: {
      allowNull: true,
      type: Sequelize.TEXT
    }
  },
  { paranoid: true }
);

module.exports = GeotechnicalInvestigationProjectMetadata;