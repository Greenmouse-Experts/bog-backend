/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("testimonies", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isHomepage: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      star: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("testimonies");
  }
};
