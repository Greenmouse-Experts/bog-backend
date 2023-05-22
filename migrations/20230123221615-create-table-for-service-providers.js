/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("service_providers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      projectId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      estimatedCost: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "accepted", "rejected"]
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("service_providers");
  }
};
