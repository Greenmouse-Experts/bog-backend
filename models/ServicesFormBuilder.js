const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ServiceType = require("./ServiceType");

const ServicesFormBuilders = sequelise.define(
  "ServicesFormBuilders",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    serviceTypeID: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    serviceName: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    label: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    inputType: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    placeholder: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    value: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    required: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    isActive: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    access: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    inline: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    toggle: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    other: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    subLabel: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    selected: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    className: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    requireValidOption: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    multiple: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    },
    subtype: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  }
  // { paranoid: true }
);

ServiceType.hasMany(ServicesFormBuilders, {
  foreignKey: "serviceTypeID",
  as: "serviceType",
  onDelete: "cascade",
  hooks: true,
});

ServicesFormBuilders.belongsTo(ServiceType, {
  foreignKey: "serviceTypeID",
  as: "serviceType",
  onDelete: "cascade",
  hooks: true,
});

module.exports = ServicesFormBuilders;
