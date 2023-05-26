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
const ProjectReview = require("../models/ProjectReviews");
const OrderReview = require("../models/order_reviews");
const OrderItem = require("../models/OrderItem");


// create reviews
exports.createReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      req.body.userId = userId;

      const {orderId, star, review} = req.body;

      const orderconfirm = await OrderItem.findAll({where: {orderId}, ownerId: userId});
  

      if (orderconfirm === null || orderconfirm === "undefined" || orderconfirm == "undefined" || orderconfirm.length < 1 ) {
        return res.status(404).send({
          success: false,
          message: "You cant review an order youve not made!",
        });
      }

      await OrderReview.create(req.body, {transaction: t});

        const user = await User.findByPk(userId, { attributes: ["name"] });
        const order = await Order.findOne({
          where: { id: orderId },
          attributes: ["orderSlug"],
        });

      
      // console.log(order)
      const mesg = `${user.name} gave a review on an order ${order.orderSlug}`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId,
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.status(200).send({
        success: true,
        message: "Order Review submitted",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

/**
 * Create Review v2
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createReviewV2 = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const { name } = req._credentials;

      const { product, orderSlug } = req.body;

      /**
       * Verify that order exists by slug
       */
      const r01 = await Order.findOne({ where: { orderSlug } });
      if (r01 === null) {
        return res.status(404).send({
          success: false,
          message: "Order not found!",
        });
      }

      /**
       * Verify that product exists!
       */
      product.forEach(async (pr) => {
        const response = await Product.findOne({
          where: { id: pr.productId },
        });
        if (response === null) {
          return res.status(404).send({
            success: false,
            message: "Product not found!",
          });
        }
      });

      /**
       * Add review for order
       */
      const { review, star } = product[0];
      const r1 = await OrderReview.create({
        review,
        star,
        orderId: r01.id,
        userId
      });

      /**
       * Add reviews for a product
       */
      product.forEach(async (pr) => {
        const { review, star, productId } = pr;

        let r2 = await ProductReview.create({
          review,
          star,
          productId,
          userId,
        });
      });

      /**
       * Notification with sockets
       */
      const mesg = `${name} gave a review on an order ${r01.orderSlug}`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId,
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.send({
        success: true,
        message: "Review submitted",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.createProductReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { name } = req._credentials;

      const { review, star, productId, userId} = req.body;
      console.log(productId)

      const product = await Product.findOne({ where: { id: productId } });
      if (product === null) {
        return res.status(404).send({
          success: false,
          message: "product not found!",
        });
      }
      const p = JSON.stringify(product);
      console.log(userId)

      /**
       * Verify that order exists by slug
       */
      const r01 = await OrderItem.findAll({ where: {
        ownerId : userId,
        product: {[Op.substring]: `%${productId}%`},
        status: "paid"
      }});
      console.log(r01.length)
      if (r01 === null || r01 === 'undefined' || r01 == 'undefined' || r01.length < 1) {
        return res.status(404).send({
          success: false,
          message: "You cant review a product youve not bought before!",
        });
      }

      


        let r2 = await ProductReview.create({
          review,
          star,
          productId,
          userId,
        });

      /**
       * Notification with sockets
       */
      const mesg = `${name} gave a review on an product ${product}`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId,
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.send({
        success: true,
        message: "Review submitted",
      });
    } catch (error) {
      console.log(error)
      t.rollback();
      return next(error);
    }
  });
};

// update review

exports.updateReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await ProductReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ProductReview.update(others, {
        where: { id: reviewId },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Review updated",
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
      productId: req.query.productId,
    };
    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    const reviews = await ProductReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
      // include: [
      //   {
      //     model: Product,
      //     as: "product_info",
      //     attributes: ["id", "name", "price", "image"]
      //   }
      // ]
    });

    return res.status(200).send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
};

// delete reviews
exports.deleteReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId } = req.query;
      const where = { id: reviewId };

      const isExist = await ProductReview.findOne({ where });
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ProductReview.destroy({
        where: { id: reviewId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Review deleted successfully",
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
  sequelize.transaction(async (t) => {
    try {
      const ownerId = req.user.id;
      req.body.userId = ownerId;

      const myReview = await ServiceReview.create(req.body, {
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// update review

exports.updateServiceReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await ServiceReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ServiceReview.update(others, {
        where: { id: reviewId },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Review updated",
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
      partnerId: req.query.partnerId,
    };

    const reviews = await ServiceReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
};

// delete reviews

exports.deleteServiceReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId } = req.query;
      const where = { id: reviewId };

      const isExist = await ServiceReview.findOne({ where });
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ServiceReview.destroy({
        where: { id: reviewId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

/**
 * Project review
 */

// create reviews
exports.createProjectReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const ownerId = req.user.id;
      req.body.userId = ownerId;

      const myReview = await ProjectReview.create(req.body, {
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// update review

exports.updateProjectReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await ProjectReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ProjectReview.update(others, {
        where: { id: reviewId },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Review updated",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// get all project review
exports.getAllProjectReview = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const where = {
      userId: clientId,
    };

    const reviews = await ProjectReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return next(error);
  }
};

// delete reviews

exports.deleteProjectReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { reviewId } = req.query;
      const where = { id: reviewId };

      const isExist = await ProjectReview.findOne({ where });
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found",
        });
      }

      await ProjectReview.destroy({
        where: { id: reviewId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
