/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const userIdColumn = await queryInterface.addColumn(
          "meetings",
          "userId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(userIdColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const userIdColumn = await queryInterface.removeColumn(
        "meetings",
        "userId",
        {
          transaction: t
        }
      );

      return Promise.all(userIdColumn);
    })
};
