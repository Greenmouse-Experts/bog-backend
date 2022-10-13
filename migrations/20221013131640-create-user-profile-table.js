/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("user_profiles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      company_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cac_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      years_of_experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      certificate_of_operation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      professional_certificate: {
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
    return queryInterface.dropTable("user_profiles");
  }
};
