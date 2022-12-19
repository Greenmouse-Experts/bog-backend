/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
const Transaction = require("../models/Transaction");
const sequelize = require("../config/database/connection");

const generateDesc = order_items => {
  const data = order_items.map(
    item => `${item.quantity} of ${item.product.name}`
  );
  const joined = data.join(" and ");
  console.log(joined);
  return `Bought ${joined}`;
};
exports.saveTxn = async (data, type) => {
  sequelize.transaction(async t => {
    const { orderSlug, userId, order_items } = data;
    let description;
    type === "Products" && (description = generateDesc(order_items));
    type === "Service" && (description = `Payment for {service} request`);
    data.TransactionId = data.orderSlug;
    const saveThis = {
      type,
      TransactionId: orderSlug,
      userId,
      description,
      paymentReference: order_items[0].paymentInfo.reference,
      status: "successful"
    };
    try {
      await Transaction.create(saveThis);
      return true;
    } catch (error) {
      t.rollback();
      return false;
    }
  });
};

exports.getAllTxns = async (req, res, next) => {
  try {
    const where = { userId: req.params.userId };
    const Txns = await Transaction.findAll({
      where
    });

    return res.status(200).send({
      success: true,
      data: Txns
    });
  } catch (error) {
    return next(error);
  }
};

exports.getOneTxns = async (req, res, next) => {
  try {
    const where = { id: req.query.txn };
    const Txns = await Transaction.findOne({
      where
    });
    return res.status(200).send({
      success: true,
      data: Txns
    });
  } catch (error) {
    return next(error);
  }
};
