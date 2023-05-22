/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const statusColumn = await queryInterface.changeColumn(
          "projects",
          "status",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(statusColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const statusColumn = await queryInterface.changeColumn(
        "projects",
        "status",
        {
          type: Sequelize.ENUM(
            "pending",
            "approved",
            "ongoing",
            "cancelled",
            "completed",
            "draft",
            "closed"
          ),
          allowNull: true
        },
        { transaction: t }
      );

      return Promise.all(statusColumn);
    })
};
