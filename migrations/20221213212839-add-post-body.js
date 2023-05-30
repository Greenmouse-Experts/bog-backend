/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const bodyColumn = await queryInterface.addColumn(
          "blogs",
          "body",
          {
            type: Sequelize.TEXT,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(bodyColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const bodyColumn = await queryInterface.removeColumn("blogs", "body", {
        transaction: t
      });

      return Promise.all(bodyColumn);
    })
};
