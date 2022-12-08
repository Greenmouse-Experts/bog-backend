/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable(
      "constructor_drawing_projects",
      {
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
        projectId: {
          type: Sequelize.UUID,
          allowNull: true
        },
        clientName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        propertyName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        projectLocation: {
          type: Sequelize.STRING,
          allowNull: true
        },
        propertyLga: {
          type: Sequelize.STRING,
          allowNull: true
        },
        projectType: {
          type: Sequelize.ENUM,
          allowNull: true,
          values: [
            "residential",
            "commercial",
            "religious",
            "industrial",
            "educational"
          ]
        },
        drawingType: {
          type: Sequelize.ENUM,
          allowNull: true,
          values: [
            "architectural",
            "structural",
            "mechanical",
            "electrical",
            "all"
          ]
        },
        buildingType: {
          type: Sequelize.STRING,
          allowNull: true
        },
        status: {
          allowNull: true,
          type: Sequelize.ENUM,
          values: ["pending", "approved", "ongoing", "cancelled", "completed"],
          defaultValue: "pending"
        },
        surveyPlan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        structuralPlan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        architecturalPlan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        mechanicalPlan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        electricalPlan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE },
        deletedAt: { allowNull: true, type: Sequelize.DATE }
      }
    );
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("constructor_drawing_projects");
  }
};
