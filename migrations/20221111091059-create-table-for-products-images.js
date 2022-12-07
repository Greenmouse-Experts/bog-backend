/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("product_images", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      image: {
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
    return queryInterface.dropTable("product_images");
  }
};
