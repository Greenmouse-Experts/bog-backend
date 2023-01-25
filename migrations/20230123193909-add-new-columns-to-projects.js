/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const approvalStatus = await queryInterface.addColumn(
          "projects",
          "approvalStatus",
          {
            type: Sequelize.ENUM(
              "pending",
              "approved",
              "disapproved",
              "in_review"
            ),
            allowNull: true,
            defaultValue: "pending"
          },
          {
            transaction: t
          }
        );

        const ServiceProviderColumn = await queryInterface.addColumn(
          "projects",
          "serviceProviderId",
          {
            type: Sequelize.UUID,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const totalCostColumn = await queryInterface.addColumn(
          "projects",
          "totalCost",
          {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0.0
          },
          {
            transaction: t
          }
        );
        const estimatedCostColumn = await queryInterface.addColumn(
          "projects",
          "estimatedCost",
          {
            type: Sequelize.FLOAT,
            allowNull: true,
            defaultValue: 0.0
          },
          {
            transaction: t
          }
        );
        const statusColumn = await queryInterface.changeColumn(
          "projects",
          "status",
          {
            type: Sequelize.ENUM(
              "pending",
              "approved",
              "ongoing",
              "cancelled",
              "completed",
              "draft",
              "closed"
            ),
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(
          approvalStatus,
          ServiceProviderColumn,
          totalCostColumn,
          estimatedCostColumn,
          statusColumn
        );
      } catch (error) {
        return t.rollback();
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async t => {
      const approvalStatus = await queryInterface.removeColumn(
        "projects",
        "approvalStatus",
        {
          transaction: t
        }
      );
      const ServiceProviderColumn = await queryInterface.removeColumn(
        "projects",
        "serviceProviderId",
        {
          transaction: t
        }
      );
      const totalCostColumn = await queryInterface.removeColumn(
        "projects",
        "totalCost",
        {
          transaction: t
        }
      );
      const estimatedCostColumn = await queryInterface.removeColumn(
        "projects",
        "estimatedCost",
        {
          transaction: t
        }
      );
      const statusColumn = await queryInterface.changeColumn(
        "projects",
        "status",
        {
          type: Sequelize.ENUM(
            "pending",
            "approved",
            "ongoing",
            "cancelled",
            "completed"
          ),
          allowNull: true
        },
        { transaction: t }
      );

      return Promise.all(
        approvalStatus,
        ServiceProviderColumn,
        totalCostColumn,
        estimatedCostColumn,
        statusColumn
      );
    })
};
