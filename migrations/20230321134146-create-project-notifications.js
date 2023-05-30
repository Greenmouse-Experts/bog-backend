'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      projectId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      serviceProviderID: {
        type: Sequelize.STRING
      },
      by: {
        type: Sequelize.ENUM,
        values: ["admin", "service_partner"]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_notifications');
  }
};