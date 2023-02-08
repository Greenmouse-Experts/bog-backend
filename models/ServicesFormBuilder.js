

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ServiceType = require('./ServiceType');

const ServicesFormBuilders = sequelise.define(
  "ServicesFormBuilders",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    serviceTypeID: {
      allowNull: true,
      type: Sequelize.STRING
    },
    serviceName: {
      allowNull: true,
      type: Sequelize.STRING
    },
    label: {
      allowNull: true,
      type: Sequelize.STRING
    },
    inputType: {
      allowNull: true,
      type: Sequelize.STRING
    },
    placeholder: {
      allowNull: true,
      type: Sequelize.STRING
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    value: {
      allowNull: true,
      type: Sequelize.STRING
    },
    required: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    isActive: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    }
  }
  // { paranoid: true }
);

ServiceType.hasMany(ServicesFormBuilders, {
  foreignKey: "serviceTypeID",
  as: "serviceType",
  onDelete: "cascade",
  hooks: true
})


ServicesFormBuilders.belongsTo(ServiceType, {
  foreignKey: "serviceTypeID",
  as: "serviceType",
  onDelete: "cascade",
  hooks: true
})

module.exports = ServicesFormBuilders;
