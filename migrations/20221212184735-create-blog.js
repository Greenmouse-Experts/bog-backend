/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("blogs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      categoryId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
          type: Sequelize.ENUM(
              "draft", "published", "review", "cancel"
          ),
          allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("blogs");
  }
};
