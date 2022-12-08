/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      trackingId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        allowNull: true,
        type: Sequelize.ENUM,
        values: [
          "paid",
          "awaiting_shipment",
          "shipped",
          "delivered",
          "cancelled",
          "refunded",
          "declined",
          "completed"
        ]
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      productOwner: {
        type: Sequelize.UUID,
        allowNull: true
      },
      shippingAddress: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      product: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      paymentInfo: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      deliveryFee: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      returnDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
      deletedAt: { allowNull: true, type: Sequelize.DATE }
    });
    return Promise.all(table);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("order_items");
  }
};
