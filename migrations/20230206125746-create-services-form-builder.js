'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServicesFormBuilders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceTypeID: {
        type: Sequelize.STRING
      },
      serviceName: {
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
      },
      inputType: {
        type: Sequelize.STRING
      },
      placeholder: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
      required: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      access: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      inline: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      toggle: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      other: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      subLabel: {
        allowNull: true,
        type: Sequelize.STRING
      },
      selected: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      className: {
        allowNull: true,
        type: Sequelize.STRING
      },
      requireValidOption: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      multiple: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      subtype: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isActive: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ServicesFormBuilders');
  }
};