/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
const Transaction = require('../models/Transaction');
const TransactionPending = require('../models/TransactionPending');
const sequelize = require('../config/database/connection');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Subscription = require('../models/Subscription');
const ServicePartner = require('../models/ServicePartner');
const ProductPartner = require('../models/ProductPartner');
const Project = require('../models/Project');

const generateDesc = (order_items) => {
  const data = order_items.map(
    (item) => `${item.quantity} of ${item.product.name}`
  );
  const joined = data.join(' and ');
  return `Bought ${joined}`;
};
exports.saveTxn = async (data, type) => {
  sequelize.transaction(async (t) => {
    const { slug, userId, order_items } = data;
    let description;
    type === 'Products' && (description = generateDesc(order_items));
    type === 'Service' && (description = `Payment for service`);
    type === 'Subscription' && (description = `Payment for Subscription`);
    data.TransactionId = data.slug;
    const saveThis = {
      type,
      amount: data.totalAmount,
      TransactionId: slug,
      userId,
      description,
      paymentReference: order_items[0].paymentInfo.reference,
      status: 'successful',
    };
    try {
      await Transaction.create(saveThis);
      return true;
    } catch (error) {
      console.log(error);
      t.rollback();
      return false;
    }
  });
};

exports.getAllTxns = async (req, res, next) => {
  try {
    const Txns = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'photo', 'email', 'userType', 'phone'],
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: Txns,
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
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).send({
      success: true,
      data: Txns,
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
          where,
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        })
      )
    );

    if (Txns === null) {
      return res.status(404).json({
        success: false,
        message: 'Txn not found!',
      });
    }
    const { TransactionId, userId, type, amount } = Txns;
    const detail = await this.getTransactionDetail({
      txId: TransactionId,
      userId,
      type,
      amount,
      Txns,
    });
    return res.status(200).send({
      success: true,
      data: {
        transaction: {
          user: detail ? (detail.user ? detail?.user : Txns?.user) : null,
          ...Txns,
        },
        detail,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getTransactionDetail = async ({
  type,
  userId,
  txId,
  amount = 0,
  Txns,
}) => {
  try {
    let detail;
    if (type === 'Products') {
      const where = {
        orderSlug: txId,
        userId,
      };
      detail = JSON.parse(
        JSON.stringify(
          await Order.findOne({
            where,
            include: [
              {
                model: OrderItem,
                as: 'order_items',
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'fname', 'lname'],
                  },
                ],
              },
            ],
          })
        )
      );
    }
    if (type === 'Subscription') {
      // Todo: Service request
      detail = JSON.parse(
        JSON.stringify(
          await Subscription.findOne({
            where: { userId, amount },
          })
        )
      );
      let user = JSON.parse(
        JSON.stringify(
          await ServicePartner.findOne({
            where: { id: userId },
            include: ['service_user'],
          })
        )
      );
      if (!user) {
        user = JSON.parse(
          JSON.stringify(
            await ProductPartner.findOne({
              where: { id: userId },
              include: ['product_user'],
            })
          )
        );
      }
      detail.user = user.product_user ? user.product_user : user.service_user;
    }
    if (type.includes('Project')) {
      const { description } = Txns;
      let projectSlug = description.split(' ')[
        description.split(' ').length - 1
      ];
      ['[', ']'].forEach((values) => {
        projectSlug = projectSlug
          .split('')
          .filter((character) => character !== values)
          .join('');
      });

      // Get project
      const project_details = await Project.findOne({ where: { projectSlug } });
      if (project_details !== null) {
        const service_partner_details = await ServicePartner.findOne({
          where: { id: project_details.serviceProviderId },
        });
        if (service_partner_details !== null) {
          const user_details = await User.findOne({
            where: { id: service_partner_details.userId },
          });
          if (user_details !== null) {
            detail = project_details;
            detail.user = user_details;
          }
        }
      }
    }
    return detail;
  } catch (error) {
    return error;
  }
};

exports.addTrxProof = async (req, res, next) => {
  try {
    const { trx_proof } = req.body;
    const where = { id: req.params.txId };
    const Txns = JSON.parse(
      JSON.stringify(
        await TransactionPending.findOne({
          where,
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        })
      )
    );

    if (Txns === null) {
      return res.status(404).json({
        success: false,
        message: 'Txn not found!',
      });
    }

    // Update trx
    await TransactionPending.update({ trx_proof }, { where });

    return res.status(200).send({
      success: true,
      message: 'Transaction proof added successfully.',
    });
  } catch (error) {
    return next(error);
  }
};
