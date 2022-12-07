/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const levelColumn = await queryInterface.addColumn(
          "users",
          "level",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
          },
          {
            transaction: t
          }
        );

        return Promise.all(levelColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const levelColumn = await queryInterface.removeColumn("users", "level", {
        transaction: t
      });

      return Promise.all(levelColumn);
    })
};
