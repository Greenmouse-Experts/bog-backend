/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const moment = require('moment');
const sequelize = require('../config/database/connection');
const Testimony = require('../models/Testimonies');
const User = require('../models/User');
const Notification = require('../helpers/notification');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const SubscriptionPlanPackage = require('../models/SubscriptionPlanPackage');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const UserService = require('../service/UserService');
const ServicePartner = require('../models/ServicePartner');
const ProductPartner = require('../models/ProductPartner');

exports.createSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const plan = await SubscriptionPlan.create(req.body, {
        include: [
          {
            model: SubscriptionPlanPackage,
            as: 'benefits',
          },
        ],
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        data: plan,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { benefits, planId, ...other } = req.body;
      const plan = await SubscriptionPlan.findByPk(planId);
      await plan.update(other, { transaction: t });
      await Promise.all(
        benefits.map(async (item) => {
          const benefit = await SubscriptionPlanPackage.findByPk(item.id);
          if (benefit) {
            await benefit.update({ benefit: item.benefit }, { transaction: t });
          } else {
            await SubscriptionPlanPackage.create(
              {
                benefit: item.benefit,
                planId,
              },
              { transaction: t }
            );
          }
        })
      );

      return res.status(200).send({
        success: true,
        message: 'Subscription plan updated successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { planId } = req.params;
      const plan = await SubscriptionPlan.destroy({
        where: { id: planId },
        include: [
          {
            model: SubscriptionPlanPackage,
            as: 'benefits',
          },
        ],
      });

      return res.status(200).send({
        success: true,
        message: 'Subscription plan delete successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: SubscriptionPlanPackage,
          as: 'benefits',
        },
      ],
    });
    return res.status(200).send({
      success: true,
      data: plans,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSingleSubscriptionPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      where: { id: req.params.planId },
      include: [
        {
          model: SubscriptionPlanPackage,
          as: 'benefits',
        },
      ],
    });
    return res.status(200).send({
      success: true,
      data: plan,
    });
  } catch (error) {
    return next(error);
  }
};

exports.subscribeToPlan = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userId, reference, planId, userType } = req.body;
      const plan = await SubscriptionPlan.findOne({ where: { id: planId } });
      const { duration, amount, name } = plan;
      const profile = await UserService.getUserTypeProfile(userType, userId);
      const { id } = profile;
      // safe payment made for reference
      const paymentData = {
        userId: id,
        payment_reference: reference,
        amount,
        payment_category: 'Subscription',
      };

      await Payment.create(paymentData, { transaction: t });
      // get user has active sub
      const sub = await Subscription.findOne({
        where: { userId: id, status: 1 },
      });
      const now = moment();
      let remainingDays = 0;
      if (sub) {
        // get expiration Date
        const { expiredAt } = sub;
        const then = moment(expiredAt);
        remainingDays = then.diff(now, 'days');
        // console.log(expiredAt, remainingDays);
        await sub.update({ status: 0 }, { transaction: t });
      }
      const days = Number(duration) * 7 + remainingDays;

      // create subscription
      const newDate = moment(now, 'DD-MM-YYYY').add(days, 'days');
      const request = {
        userId: id,
        planId,
        status: 1,
        expiredAt: newDate,
        amount,
      };
      await Subscription.create(request, { transaction: t });
      // update user profile
      const userData = {
        planId,
        hasActiveSubscription: true,
        expiredAt: newDate,
      };
      await UserService.updateUserTypeProfile({
        id,
        userType,
        data: userData,
        transaction: t,
      });

      // save transaction
      const description = `Made Payment for ${plan.name}`;
      const slug = Math.floor(190000000 + Math.random() * 990000000);
      const txSlug = `BOG/TXN/${slug}`;
      const transaction = {
        TransactionId: txSlug,
        userId: id,
        type: 'Subscription',
        amount,
        description,
        paymentReference: reference,
        status: 'PAID',
        userType,
      };
      await Transaction.create(transaction, { transaction: t });
      const user = await User.findByPk(userId);

      // Notify admin
      const mesg = `${
        user.name ? user.name : `${user.fname} ${user.lname}`
      } just subscribed to ${name} with their ${UserService.getUserType(
        userType
      )} account`;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId: id,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      return res.send({
        success: true,
        message: 'Subscription Made Sucessfully',
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getSubscriptionHistory = async (req, res, next) => {
  try {
    const plans = await Subscription.findAll({
      order: [['createdAt', 'DESC']],
    });
    const subscriptions = await Promise.all(
      plans.map(async (plan) => {
        let user = await ServicePartner.findOne({
          where: { id: plan.userId },
        });
        if (!user) {
          user = await ProductPartner.findOne({
            where: { id: plan.userId },
          });
        }
        plan.user = user;
        return plan;
      })
    );
    return res.status(200).send({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUserSubscriptionHistory = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).send({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    return next(error);
  }
};
