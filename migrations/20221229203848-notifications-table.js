/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      type: {
        allowNull: true,
        type: Sequelize.ENUM("user", "admin")
      },
      message: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      isRead: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ["pending", "read", "unread"],
        defaultValue: "pending"
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("notifications");
  }
};
