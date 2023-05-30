/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const serviceTypeIdColumn = await queryInterface.addColumn(
          "service_partners",
          "serviceTypeId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(serviceTypeIdColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const serviceTypeIdColumn = await queryInterface.removeColumn(
        "service_partners",
        "serviceTypeId",
        {
          transaction: t
        }
      );

      return Promise.all(serviceTypeIdColumn);
    })
};
