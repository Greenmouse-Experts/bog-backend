/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const categoryId = await queryInterface.removeColumn(
          "blogs",
          "categoryId",
          {
            transaction: t
          }
        );
        return Promise.all(categoryId);
      } catch (error) {
        console.log(error);
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const categoryId = await queryInterface.addColumn(
        "blogs",
        "categoryId",
        {
          type: Sequelize.UUID,
          allowNull: true
        },
        {
          transaction: t
        }
      );
      return Promise.all(categoryId);
    })
};
