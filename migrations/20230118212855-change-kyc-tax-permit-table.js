module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      "kyc_tax_permits",
      "relevant_statutory",
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      "kyc_tax_permits",
      "relevant_statutory",
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  }
};
