/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("project_biddings", {
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
      projectId: {
        allowNull: true,
        type: Sequelize.UUID
      },
      projectCost: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
        allowNull: true
      },
      deliveryTimeLine: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      areYouInterested: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      reasonOfInterest: {
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
    return queryInterface.dropTable("project_biddings");
  }
};
