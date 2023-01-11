/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("kyc_tax_permits", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      userType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      VAT: {
        type: Sequelize.STRING,
        allowNull: true
      },
      TIN: {
        type: Sequelize.STRING,
        allowNull: true
      },
      relevant_statutory: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("kyc_tax_permits");
  }
};
