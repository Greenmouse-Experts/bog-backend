// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class ServicesFormBuilder extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   ServicesFormBuilder.init({
//     serviceName: DataTypes.STRING,
//     label: DataTypes.STRING,
//     inputType: DataTypes.STRING,
//     placeholder: DataTypes.STRING,
//     name: DataTypes.STRING,
//     value: DataTypes.STRING,
//     required: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'ServicesFormBuilder',
//   });
//   return ServicesFormBuilder;
// };

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const ServicesFormBuilders = sequelise.define(
  "ServicesFormBuilders",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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

module.exports = ServicesFormBuilders;
