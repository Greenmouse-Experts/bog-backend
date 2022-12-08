/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("payments", {
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
      payment_category: {
        allowNull: true,
        type: Sequelize.STRING
      },
      payment_reference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("payments");
  }
};
