/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const isSuspendedColumn = await queryInterface.addColumn(
          "users",
          "isSuspended",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );

        return Promise.all(isSuspendedColumn);
      } catch (error) {
        // return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const isSuspendedColumn = await queryInterface.removeColumn(
        "users",
        "isSuspended",
        {
          transaction: t
        }
      );

      return Promise.all(isSuspendedColumn);
    })
};
