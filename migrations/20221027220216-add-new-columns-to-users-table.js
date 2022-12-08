/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const fnameColumn = await queryInterface.addColumn(
          "users",
          "fname",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const lnameColumn = await queryInterface.addColumn(
          "users",
          "lname",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const referralIdColumn = await queryInterface.addColumn(
          "users",
          "referralId",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const aboutUsColumn = await queryInterface.addColumn(
          "users",
          "aboutUs",
          {
            type: Sequelize.STRING,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(
          fnameColumn,
          lnameColumn,
          referralIdColumn,
          aboutUsColumn
        );
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const fnameColumn = await queryInterface.removeColumn("users", "fname", {
        transaction: t
      });
      const lnameColumn = await queryInterface.removeColumn("users", "lname", {
        transaction: t
      });
      const referralIdColumn = await queryInterface.removeColumn(
        "users",
        "referralId",
        {
          transaction: t
        }
      );
      const aboutUsColumn = await queryInterface.removeColumn(
        "users",
        "aboutUs",
        {
          transaction: t
        }
      );

      return Promise.all(
        fnameColumn,
        lnameColumn,
        referralIdColumn,
        aboutUsColumn
      );
    })
};
