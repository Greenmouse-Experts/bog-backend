/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("reviews", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      star: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      review: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reviews");
  }
};
