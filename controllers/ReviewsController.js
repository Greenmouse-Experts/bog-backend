/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const ProductReview = require("../models/Reviews");
const ServiceReview = require("../models/ServiceReview");
const Product = require("../models/Product");
const User = require("../models/User");
const Notification = require("../helpers/notification");
const Order = require("../models/Order");

// create reviews
exports.createReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      req.body.userId = userId;

      const myReview = await ProductReview.create(req.body, {
        transaction: t
      });

      const user = await User.findByPk(userId, { attributes: ["name"] });
      const order = await Order.findByPk(req.body.productId, {
        attributes: ["orderSlug"]
      });
      const mesg = `${user.name} gave a review on an order ${order.orderSlug}`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// update review

exports.updateReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await ProductReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await ProductReview.update(others, {
        where: { id: reviewId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Review updated"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// get all product review
exports.getAllProductReview = async (req, res, next) => {
  try {
    const where = {
      productId: req.query.productId
    };
    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    const reviews = await ProductReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          as: "product_info",
          attributes: ["id", "name", "price", "image"]
        }
      ]
    });

    return res.status(200).send({
      success: true,
      data: reviews
    });
  } catch (error) {
    return next(error);
  }
};

// delete reviews
exports.deleteReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId } = req.query;
      const where = { id: reviewId };

      const isExist = await ProductReview.findOne({ where });
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await ProductReview.destroy({
        where: { id: reviewId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

/* ---------Service Reviews-------- */

// create reviews
exports.createServiceReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const ownerId = req.user.id;
      req.body.userId = ownerId;

      const myReview = await ServiceReview.create(req.body, {
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// update review

exports.updateServiceReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await ServiceReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await ServiceReview.update(others, {
        where: { id: reviewId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Review updated"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// get all product review
exports.getAllServiceReview = async (req, res, next) => {
  try {
    const where = {
      partnerId: req.query.partnerId
    };

    const reviews = await ServiceReview.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).send({
      success: true,
      data: reviews
    });
  } catch (error) {
    return next(error);
  }
};

// delete reviews

exports.deleteServiceReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId } = req.query;
      const where = { id: reviewId };

      const isExist = await ServiceReview.findOne({ where });
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await ServiceReview.destroy({
        where: { id: reviewId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
