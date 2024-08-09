/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op, Sequelize } = require("sequelize");
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
const UserService = require("../service/UserService");
const Project = require("../models/Project");
const ServicePartner = require("../models/ServicePartner");
const { avg_rating } = require("../helpers/utility");

// create reviews
exports.createReview = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      req.body.userId = userId;

      const { orderId, star, review } = req.body;

      const orderconfirm = await OrderItem.findAll({
        where: { orderId },
        ownerId: userId,
      });

      if (
        orderconfirm === null ||
        orderconfirm === "undefined" ||
        orderconfirm == "undefined" ||
        orderconfirm.length < 1
      ) {
        return res.status(404).send({
          success: false,
          message: "You cant review an order youve not made!",
        });
      }

      await OrderReview.create(req.body, { transaction: t });

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
        userId,
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

      const { review, star, productId, userId } = req.body;
      console.log(productId);

      const product = await Product.findOne({ where: { id: productId } });
      if (product === null) {
        return res.status(404).send({
          success: false,
          message: "product not found!",
        });
      }
      const p = JSON.stringify(product);
      console.log(userId);

      /**
       * Verify that order exists by slug
       */
      const r01 = await OrderItem.findAll({
        where: {
          ownerId: userId,
          product: { [Op.substring]: `%${productId}%` },
          status: "paid",
        },
      });
      console.log(r01.length);
      if (
        r01 === null ||
        r01 === "undefined" ||
        r01 == "undefined" ||
        r01.length < 1
      ) {
        return res.status(404).send({
          success: false,
          message: "You cant review a product youve not bought before!",
        });
      }

      const productreviewcheck = await ProductReview.findAll({
        where: { productId: productId, userId: userId },
      });
      console.log(productreviewcheck);
      if (
        productreviewcheck == null ||
        productreviewcheck === "undefined" ||
        productreviewcheck == "undefined" ||
        productreviewcheck.length < 1
      ) {
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
        io.emit(
          "getNotifications",
          await Notification.fetchAdminNotification()
        );

        return res.send({
          success: true,
          message: "Review submitted",
        });
      }

      return res.status(404).send({
        success: false,
        message: "You already reviewed this product before!",
      });
    } catch (error) {
      console.log(error);
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
      include: [
        {
          model: User,
          as: "client",
        },
      ],
    });

    let review = 0;
    let total = 0;

    if (reviews.length > 0) {
      for (let i = 0; i < reviews.length; i++) {
        review += reviews[i].star;
        total += 5;
      }
    }

    console.log(reviews);

    let star1 = review > 0 ? (review / total) * 5 : 0;
    let star = (Math.round(star1) * 10) / 10;

    let reviewsfinal = {
      reviews: reviews,
      star: star,
    };

    return res.status(200).send({
      success: true,
      data: reviewsfinal,
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
      const { serviceProviderId } = req.body;
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
      const { projectId, star } = req.body;
      const ownerId = req.user.id;
      req.body.userId = ownerId;

      const project = await Project.findOne({ where: { id: projectId } });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      // Get service partner details
      const service_partner_details = await ServicePartner.findOne({
        where: { id: project.serviceProviderId },
      });

      // Get user details
      const user_details = await User.findOne({
        where: { id: service_partner_details.userId },
      });

      const myReview = await ProjectReview.create({
        ...req.body,
        serviceProviderId: project.serviceProviderId,
      });

      // Rate service partners
      await ratePartnerByReviews(
        project,
        service_partner_details,
        user_details,
        star
      );

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview,
        // rating,
      });
    } catch (error) {
      console.log(error);
      // t.rollback();
      return next(error);
    }
  });
};

const ratePartnerByReviews = async (
  project,
  service_partner_details,
  user_details,
  star
) => {
  sequelize.transaction(async (t) => {
    try {
      // Get total reviews
      const projectWithReviews = await ProjectReview.findAll({
        where: { serviceProviderId: project.serviceProviderId },
        raw: true,
      });

      // Get total review sum
      const projectWithReviewsSum = await ProjectReview.findAll({
        attributes: [[Sequelize.fn("SUM", Sequelize.col("star")), "rating"]],
        where: { serviceProviderId: project.serviceProviderId },
        raw: true,
      });

      // Get avg based on current rating
      const avg =
        (projectWithReviewsSum[0].rating + star) /
        (projectWithReviews.length + 1);

      let {
        years_of_experience_rating,
        certification_of_personnel_rating,
        no_of_staff_rating,
        complexity_of_projects_completed_rating,
        cost_of_projects_completed_rating,
        timely_delivery_peformance_rating,
      } = user_details;

      let quality_delivery_performance_rating = (
        (+avg + timely_delivery_peformance_rating) /
        2
      ).toFixed(1);

      const rating_details = {
        years_of_experience_rating: +years_of_experience_rating,
        certification_of_personnel_rating: +certification_of_personnel_rating,
        no_of_staff_rating: +no_of_staff_rating,
        complexity_of_projects_completed_rating: +complexity_of_projects_completed_rating,
        cost_of_projects_completed_rating: +cost_of_projects_completed_rating,
        quality_delivery_performance_rating: +quality_delivery_performance_rating,
        timely_delivery_peformance_rating: +timely_delivery_peformance_rating,
      };

      const avg_rating_value = avg_rating(rating_details);

      // Update Service model
      service_partner_details.rating = +avg_rating_value;
      service_partner_details.save();

      // Update User model
      user_details.quality_delivery_performance_rating = +quality_delivery_performance_rating;
      user_details.save();

    } catch (error) {
      console.log(error);
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
