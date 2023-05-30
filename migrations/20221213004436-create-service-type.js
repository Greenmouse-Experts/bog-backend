/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("service_types", {
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
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("service_types");
  }
};
