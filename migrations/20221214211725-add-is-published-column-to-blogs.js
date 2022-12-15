/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const isPublishedColumn = await queryInterface.addColumn(
          "blogs",
          "isPublished",
          {
            allowNull: true,
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        const isCommentableColumn = await queryInterface.addColumn(
          "blogs",
          "isCommentable",
          {
            allowNull: true,
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );

        return Promise.all(isPublishedColumn, isCommentableColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const isPublishedColumn = await queryInterface.removeColumn(
        "blogs",
        "isPublished",
        {
          transaction: t
        }
      );
      const isCommentableColumn = await queryInterface.removeColumn(
        "blogs",
        "isCommentable",
        {
          transaction: t
        }
      );

      return Promise.all(isPublishedColumn, isCommentableColumn);
    })
};
