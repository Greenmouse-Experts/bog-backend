/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("subscriptions", {
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
      planId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      expiredAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      amount: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      status: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("subscriptions");
  }
};
