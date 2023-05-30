/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("meetings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      projectSlug: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meetingSlug: {
        type: Sequelize.STRING,
        allowNull: true
      },
      requestId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      requestEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM,
        defaultValue: "pending",
        values: ["pending", "placed", "ongoing", "attended", "cancelled"]
      },
      approval_status: {
        type: Sequelize.ENUM,
        defaultValue: "pending",
        values: ["pending", "approved", "declined"]
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      start_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      join_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      recording: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("meetings");
  }
};
