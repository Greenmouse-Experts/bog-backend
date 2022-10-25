/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const photoColumn = await queryInterface.addColumn(
          "users",
          "photo",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(photoColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const photoColumn = await queryInterface.removeColumn("users", "photo", {
        transaction: t
      });

      return Promise.all(photoColumn);
    })
};
