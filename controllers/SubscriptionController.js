/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const sequelize = require("../config/database/connection");
const Testimony = require("../models/Testimonies");
const User = require("../models/User");
const Notification = require("../helpers/notification");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const SubscriptionPlanPackage = require("../models/SubscriptionPlanPackage");

exports.createSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const plan = await SubscriptionPlan.create(req.body, {
        include: [
          {
            model: SubscriptionPlanPackage,
            as: "benefits"
          }
        ],
        transaction: t
      });

      return res.status(200).send({
        success: true,
        data: plan
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { benefits, planId, ...other } = req.body;
      const plan = await SubscriptionPlan.findByPk(planId);
      await plan.update(other, { transaction: t });
      await Promise.all(
        benefits.map(async item => {
          const benefit = await SubscriptionPlanPackage.findByPk(item.id);
          if (benefit) {
            await benefit.update({ benefit: item.benefit }, { transaction: t });
          } else {
            await SubscriptionPlanPackage.create(
              {
                benefit: item.benefit,
                planId
              },
              { transaction: t }
            );
          }
        })
      );

      return res.status(200).send({
        success: true,
        message: "Subscription plan updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteSubscriptionPlan = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { planId } = req.params;
      const plan = await SubscriptionPlan.destroy({
        where: { id: planId },
        include: [
          {
            model: SubscriptionPlanPackage,
            as: "benefits"
          }
        ]
      });

      return res.status(200).send({
        success: true,
        message: "Subscription plan delete successfully"
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
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: SubscriptionPlanPackage,
          as: "benefits"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: plans
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
          as: "benefits"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: plan
    });
  } catch (error) {
    return next(error);
  }
};
