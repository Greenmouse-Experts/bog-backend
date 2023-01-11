/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable(
      "kyc_organisation_informations",
      {
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
        organisation_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        others: {
          type: Sequelize.STRING,
          allowNull: true
        },
        Incorporation_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        director_fullname: {
          type: Sequelize.STRING,
          allowNull: true
        },
        director_designation: {
          type: Sequelize.STRING,
          allowNull: true
        },
        director_phone: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        director_email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        contact_phone: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        contact_email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        others_operations: {
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
    return queryInterface.dropTable("kyc_organisation_informations");
  }
};
