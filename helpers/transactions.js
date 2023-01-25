/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
const Transaction = require("../models/Transaction");
const sequelize = require("../config/database/connection");
const User = require("../models/User");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const generateDesc = order_items => {
  const data = order_items.map(
    item => `${item.quantity} of ${item.product.name}`
  );
  const joined = data.join(" and ");
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
      amount: data.totalAmount,
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
    const Txns = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "photo", "email", "userType", "phone"]
        }
      ]
    });

    return res.status(200).send({
      success: true,
      data: Txns
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllUserTxns = async (req, res, next) => {
  try {
    const where = { userId: req.user.id };
    const Txns = await Transaction.findAll({
      where,
      order: [["createdAt", "DESC"]]
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
    const where = { id: req.params.txId };
    const Txns = JSON.parse(
      JSON.stringify(
        await Transaction.findOne({
          where
        })
      )
    );
    const { TransactionId, userId, type } = Txns;
    const detail = await this.getTransactionDetail({
      txId: TransactionId,
      userId,
      type
    });
    return res.status(200).send({
      success: true,
      data: {
        transaction: Txns,
        detail
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getTransactionDetail = async ({ type, userId, txId }) => {
  try {
    let detail;
    if (type === "Products") {
      const where = {
        orderSlug: txId,
        userId
      };
      detail = JSON.parse(
        JSON.stringify(
          await Order.findOne({
            where,
            include: [
              {
                model: OrderItem,
                as: "order_items",
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["name", "email", "fname", "lname"]
                  }
                ]
              }
            ]
          })
        )
      );
    }
    if (type === "Service") {
      // Todo: Service request
      detail = null;
    }
    return detail;
  } catch (error) {
    return error;
  }
};
