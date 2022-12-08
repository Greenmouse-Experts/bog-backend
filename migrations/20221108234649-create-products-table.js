/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("products", {
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
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      price: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      quantity: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      unit: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      showInShop: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ["draft", "pending", "in_review", "approved", "disapproved"],
        defaultValue: "pending"
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("products");
  }
};
