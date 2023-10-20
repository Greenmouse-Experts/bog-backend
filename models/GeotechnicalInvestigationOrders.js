
const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const GeotechnicalInvestigationOrders = sequelise.define(
  "geotechnical_investigation_orders",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    userId: {
      allowNull: true,
      type: Sequelize.STRING
    },
    projectId: {
      allowNull: true,
      type: Sequelize.STRING
    },
    mobilization_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    demobilization_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_rig_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_rig_qty: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    drilling_spt_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    drilling_spt_qty: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_cpt_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    setup_dismantle_cpt_qty: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    dutch_cpt_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    dutch_cpt_qty: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    chemical_analysis_of_ground_water_amt: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
    chemical_analysis_of_ground_water_qty: {
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
    ref: {
      allowNull: true,
      type: Sequelize.STRING
    },
    lab_test_types: {
      allowNull: true,
      type: Sequelize.TEXT
    }
  },
  { paranoid: true }
);

module.exports = GeotechnicalInvestigationOrders;