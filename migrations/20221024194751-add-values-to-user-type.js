module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn("users", "userType", {
      type: Sequelize.ENUM(
        "professional",
        "vendor",
        "private_client",
        "corporate_client",
        "admin",
        "none"
      ),
      allowNull: true
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn("users", "userType", {
      type: Sequelize.ENUM(
        "professional",
        "vendor",
        "private_client",
        "corporate_client"
      ),
      allowNull: true
    });
  }
};
