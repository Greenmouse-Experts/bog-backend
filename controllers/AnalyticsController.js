const { Op } = require('sequelize');
const sequelize = require('../config/database/connection');
const Order = require('../models/Order');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');

exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    // Fetch Orders
    const orders = await Order.findAll({
      where: { status: 'approved', refundStatus: 'not refunded' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
      ],
    });

    // Fetch Projects
    const projects = await Transaction.findAll({
      where: { status: 'PAID', type: 'Projects' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
    });

    // Fetch products
    const products = await Transaction.findAll({
      where: { status: 'successful', type: 'Products' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
    });

    // Fetch Payouts
    const payouts = await Transaction.findAll({
      where: { status: 'PAID', type: { [Op.like]: '%Project Payout%' } },
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
    });

    // Summarizing the results
    const totalIncome =
      (orders[0]?.totalAmount || 0) + (products[0]?.totalAmount || 0);
    const totalExpenditure =
      (payouts[0]?.total || 0) + (projects[0]?.totalAmount || 0);

    return res.send({
      success: true,
      data: {
        totalIncome,
        totalExpenditure,
        breakdown: {
          orders: orders[0]?.totalAmount || 0,
          projects: projects[0]?.totalAmount || 0,
          products: products[0]?.totalAmount || 0,
          payouts: payouts[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
