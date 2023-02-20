const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ServicePartner = require("./ServicePartner");
const Services = require("./Services");

const ServiceType = sequelise.define(
  "service_types",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING
    },
    serviceId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    description: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    slug: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

Services.hasMany(ServiceType, {
  foreignKey: "serviceId",
  as: "service_provider"
});

ServiceType.belongsTo(Services, {
  foreignKey: "serviceId",
  as: "service"
});


module.exports = ServiceType;
