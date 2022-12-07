/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const { productReview, partnerReview } = require('../models/Reviews');
const Product = require("../models/Product");
const PartnerModel = require("../models/ServicePartner");


// create reviews
exports.createReview = async(req, res, next) => {
    sequelize.transaction(async t => {
    try {
      const ownerId = req.user.id;
      req.body.userId = ownerId
          
      const myReview = await productReview.create(req.body, {
        include: [
          {
            model: Product,
            as: "product_info"
          }
        ],
        transaction: t
      })

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  })
}


// update review

exports.updateReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await productReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await productReview.update(others, { where: { id: reviewId }, transaction: t });

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
      productId: req.query.productId,
    };
    if (req.query.userId) {
      where.userId = req.query.userId;
    }
    console.log(where)
    const reviews = await productReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          as: "product_info",
          attributes: ["id", "name", "price", "image"]
        },
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
      const userId = req.user.id;
      where = { id: reviewId }
      console.log(reviewId, userId)

      const isExist = await productReview.findOne({where});
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }
      
      await productReview.destroy({
        where: { id: reviewId}, transaction: t
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




/*---------Partner Reviews-------- */

// create reviews
exports.createPartnerReview = async(req, res, next) => {
    sequelize.transaction(async t => {
    try {
      const ownerId = req.user.id;
      req.body.userId = ownerId
          
      const myReview = await partnerReview.create(req.body, {
        include: [
          {
            model: Product,
            as: "product_info"
          }
        ],
        transaction: t
      })

      return res.status(200).send({
        success: true,
        message: "Review submitted",
        myReview
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  })
}


// update review

exports.updatePartnerReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId, ...others } = req.body;
      const review = await partnerReview.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }

      await partnerReview.update(others, { where: { id: reviewId }, transaction: t });

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
exports.getAllPartnerReview = async (req, res, next) => {
  try {
    const where = {
      partnerId: req.query.partnerId,
    };
    console.log(where)
    const reviews = await partnerReview.findAll({
      where,
      order: [["createdAt", "DESC"]],
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

exports.deletePartnerReview = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { reviewId } = req.query;
      const userId = req.user.id;
      where = { id: reviewId }
      console.log(reviewId, userId)

      const isExist = await partnerReview.findOne({where});
      if (!isExist) {
        return res.status(404).send({
          success: false,
          message: "Review Not Found"
        });
      }
      
      await partnerReview.destroy({
        where: { id: reviewId}, transaction: t
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

