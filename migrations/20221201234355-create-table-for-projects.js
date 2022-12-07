/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("projects", {
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
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      projectTypes: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          "land_survey",
          "construction_drawing",
          "building_approval",
          "geotechnical_investigation",
          "contractor"
        ]
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ["pending", "approved", "ongoing", "cancelled", "completed"],
        defaultValue: "pending"
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projects");
  }
};
