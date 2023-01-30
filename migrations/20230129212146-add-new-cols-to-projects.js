/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const duration = await queryInterface.addColumn(
          "projects",
          "duration",
          {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const endDateColumn = await queryInterface.addColumn(
          "projects",
          "endDate",
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(duration, endDateColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const duration = await queryInterface.removeColumn(
        "projects",
        "duration",
        {
          transaction: t
        }
      );
      const endDateColumn = await queryInterface.removeColumn(
        "projects",
        "endDate",
        {
          transaction: t
        }
      );

      return Promise.all(duration, endDateColumn);
    })
};
