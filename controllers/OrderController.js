/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const User = require("../models/User");
const Order = require("../models/Order");
const utility = require("../helpers/utility");
const Product = require("../models/Product");

exports.getMyOrders = async (req, res, next) => {
  try {
    const where = {
      ownerId: req.user.id
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).send({
      success: true,
      data: orders
    });
  } catch (error) {
    return next(error);
  }
};

exports.getOrderRequest = async (req, res, next) => {
  try {
    const where = {
      productOwner: req.user.id
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fname", "lname", "email", "phone"]
        }
      ]
    });

    return res.status(200).send({
      success: true,
      data: orders
    });
  } catch (error) {
    return next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const ownerId = req.user.id;
      const { shippingAddress, paymentInfo, products } = req.body;
      const orders = await Promise.all(
        products.map(async product => {
          const orderId = `ORD-${utility.generateOrderId}`;
          const prodData = await Product.findByPk(product.id, {
            attributes: ["id", "name", "creatorId", "price", "unit", "image"]
          });
          const totalAmount = product.quantity * Number(prodData.price);

          return {
            orderId,
            ownerId,
            productOwner: prodData.creatorId,
            totalAmount,
            shippingAddress,
            paymentInfo,
            quantity: product.quantity,
            product: {
              id: prodData.id,
              name: prodData.name,
              price: prodData.price,
              unit: prodData.unit,
              image: prodData.image
            }
          };
        })
      );
      return res.status(200).send({
        success: true,
        message: "Order Request submitted",
        orders
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
