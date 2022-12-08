/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("geotechnical_projects", {
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
      propertyLocation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      propertyLga: {
        type: Sequelize.STRING,
        allowNull: true
      },
      landSize: {
        type: Sequelize.STRING,
        allowNull: true
      },
      propertyType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      siteHasBuilding: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: ["pending", "approved", "ongoing", "cancelled", "completed"],
        defaultValue: "pending"
      },
      propertyPicture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      noOfIntentendedBorehole: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      depthOfBorehole: {
        type: Sequelize.STRING,
        allowNull: true
      },
      noOfCpt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tonnageOfCpt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      typeOfCpt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      anySpecialInvestigation: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      comment: {
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
    return queryInterface.dropTable("geotechnical_projects");
  }
};
