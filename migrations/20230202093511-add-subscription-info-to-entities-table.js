/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        // Product partner new columns
        const productPartnerSubscriptionPlanId = await queryInterface.addColumn(
          "product_partners",
          "planId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const productPartnerSubscriptionExpDate = await queryInterface.addColumn(
          "product_partners",
          "expiredAt",
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const productPartnerSubscriptionIsActive = await queryInterface.addColumn(
          "product_partners",
          "hasActiveSubscription",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        // Private partner new columns
        const privatePartnerSubscriptionPlanId = await queryInterface.addColumn(
          "private_clients",
          "planId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const privatePartnerSubscriptionExpDate = await queryInterface.addColumn(
          "private_clients",
          "expiredAt",
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const privatePartnerSubscriptionIsActive = await queryInterface.addColumn(
          "private_clients",
          "hasActiveSubscription",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        // Service partner new columns
        const servicePartnerSubscriptionPlanId = await queryInterface.addColumn(
          "service_partners",
          "planId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const servicePartnerSubscriptionExpDate = await queryInterface.addColumn(
          "service_partners",
          "expiredAt",
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const servicePartnerSubscriptionIsActive = await queryInterface.addColumn(
          "service_partners",
          "hasActiveSubscription",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );
        // Corporate partner new columns
        const corporatePartnerSubscriptionPlanId = await queryInterface.addColumn(
          "corporate_clients",
          "planId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const corporatePartnerSubscriptionExpDate = await queryInterface.addColumn(
          "corporate_clients",
          "expiredAt",
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          {
            transaction: t
          }
        );
        const corporatePartnerSubscriptionIsActive = await queryInterface.addColumn(
          "corporate_clients",
          "hasActiveSubscription",
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          {
            transaction: t
          }
        );

        return Promise.all(
          productPartnerSubscriptionPlanId,
          productPartnerSubscriptionExpDate,
          productPartnerSubscriptionIsActive,
          privatePartnerSubscriptionPlanId,
          privatePartnerSubscriptionExpDate,
          privatePartnerSubscriptionIsActive,
          servicePartnerSubscriptionPlanId,
          servicePartnerSubscriptionExpDate,
          servicePartnerSubscriptionIsActive,
          corporatePartnerSubscriptionPlanId,
          corporatePartnerSubscriptionExpDate,
          corporatePartnerSubscriptionIsActive
        );
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      // Product partner new columns
      const productPartnerSubscriptionPlanId = await queryInterface.removeColumn(
        "product_partners",
        "planId",

        {
          transaction: t
        }
      );
      const productPartnerSubscriptionExpDate = await queryInterface.removeColumn(
        "product_partners",
        "expiredAt",

        {
          transaction: t
        }
      );
      const productPartnerSubscriptionIsActive = await queryInterface.removeColumn(
        "product_partners",
        "hasActiveSubscription",

        {
          transaction: t
        }
      );
      // Private partner new columns
      const privatePartnerSubscriptionPlanId = await queryInterface.removeColumn(
        "private_clients",
        "planId",

        {
          transaction: t
        }
      );
      const privatePartnerSubscriptionExpDate = await queryInterface.removeColumn(
        "private_clients",
        "expiredAt",

        {
          transaction: t
        }
      );
      const privatePartnerSubscriptionIsActive = await queryInterface.removeColumn(
        "private_clients",
        "hasActiveSubscription",

        {
          transaction: t
        }
      );
      // Service partner new columns
      const servicePartnerSubscriptionPlanId = await queryInterface.removeColumn(
        "service_partners",
        "planId",

        {
          transaction: t
        }
      );
      const servicePartnerSubscriptionExpDate = await queryInterface.removeColumn(
        "service_partners",
        "expiredAt",

        {
          transaction: t
        }
      );
      const servicePartnerSubscriptionIsActive = await queryInterface.removeColumn(
        "service_partners",
        "hasActiveSubscription",

        {
          transaction: t
        }
      );
      // Corporate partner new columns
      const corporatePartnerSubscriptionPlanId = await queryInterface.removeColumn(
        "corporate_clients",
        "planId",

        {
          transaction: t
        }
      );
      const corporatePartnerSubscriptionExpDate = await queryInterface.removeColumn(
        "corporate_clients",
        "expiredAt",

        {
          transaction: t
        }
      );
      const corporatePartnerSubscriptionIsActive = await queryInterface.removeColumn(
        "corporate_clients",
        "hasActiveSubscription",

        {
          transaction: t
        }
      );

      return Promise.all(
        productPartnerSubscriptionPlanId,
        productPartnerSubscriptionExpDate,
        productPartnerSubscriptionIsActive,
        privatePartnerSubscriptionPlanId,
        privatePartnerSubscriptionExpDate,
        privatePartnerSubscriptionIsActive,
        servicePartnerSubscriptionPlanId,
        servicePartnerSubscriptionExpDate,
        servicePartnerSubscriptionIsActive,
        corporatePartnerSubscriptionPlanId,
        corporatePartnerSubscriptionExpDate,
        corporatePartnerSubscriptionIsActive
      );
    })
};
