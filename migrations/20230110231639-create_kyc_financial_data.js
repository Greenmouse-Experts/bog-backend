/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("kyc_financial_infos", {
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
      account_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      banker_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_type: {
        type: Sequelize.ENUM,
        values: ["savings", "current"],
        allowNull: true
      },
      overdraft_facility: {
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
    return queryInterface.dropTable("kyc_financial_infos");
  }
};
