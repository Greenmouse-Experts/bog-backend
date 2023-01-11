/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("kyc_general_informations", {
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
      organisation_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_number: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reg_type: {
        type: Sequelize.ENUM,
        values: ["Incorporation", "Registered Business Name"]
      },
      business_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      operational_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("kyc_general_informations");
  }
};
