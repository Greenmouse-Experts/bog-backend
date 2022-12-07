/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      orderSlug: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      deliveryFee: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ["pending", "approved", "cancelled", "completed"],
        defaultValue: "pending"
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("orders");
  }
};
