/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const productPartnerKycPoint = await queryInterface.addColumn(
          "product_partners",
          "kycPoint",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          },
          {
            transaction: t
          }
        );
        const privatePartnerKycPoint = await queryInterface.addColumn(
          "private_clients",
          "kycPoint",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          },
          {
            transaction: t
          }
        );
        const servicePartnerKycPoint = await queryInterface.addColumn(
          "service_partners",
          "kycPoint",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          },
          {
            transaction: t
          }
        );
        const corporatePartnerKycPoint = await queryInterface.addColumn(
          "corporate_clients",
          "kycPoint",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
          },
          {
            transaction: t
          }
        );

        return Promise.all(
          productPartnerKycPoint,
          privatePartnerKycPoint,
          servicePartnerKycPoint,
          corporatePartnerKycPoint
        );
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const productPartnerKycPoint = await queryInterface.removeColumn(
        "product_partners",
        "kycPoint",
        {
          transaction: t
        }
      );
      const privatePartnerKycPoint = await queryInterface.removeColumn(
        "private_clients",
        "kycPoint",
        {
          transaction: t
        }
      );
      const servicePartnerKycPoint = await queryInterface.removeColumn(
        "service_partners",
        "kycPoint",
        {
          transaction: t
        }
      );
      const corporatePartnerKycPoint = await queryInterface.removeColumn(
        "corporate_clients",
        "kycPoint",
        {
          transaction: t
        }
      );

      return Promise.all(
        productPartnerKycPoint,
        privatePartnerKycPoint,
        servicePartnerKycPoint,
        corporatePartnerKycPoint
      );
    })
};
