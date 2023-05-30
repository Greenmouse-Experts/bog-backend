/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const projectSlugColumn = await queryInterface.addColumn(
          "projects",
          "projectSlug",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(projectSlugColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const projectSlugColumn = await queryInterface.removeColumn(
        "projects",
        "projectSlug",
        {
          transaction: t
        }
      );

      return Promise.all(projectSlugColumn);
    })
};
