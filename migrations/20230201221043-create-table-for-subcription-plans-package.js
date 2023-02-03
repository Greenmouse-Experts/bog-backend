/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable(
      "subscription_plan_packages",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          unique: true,
          primaryKey: true
        },
        planId: {
          allowNull: true,
          type: Sequelize.UUID
        },
        benefit: {
          allowNull: true,
          type: Sequelize.STRING
        },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
        deletedAt: { allowNull: true, type: Sequelize.DATE }
      }
    );
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("subscription_plan_packages");
  }
};
