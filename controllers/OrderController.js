/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const User = require("../models/User");
const Order = require("../models/Order");
const utility = require("../helpers/utility");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const OrderItem = require("../models/OrderItem");
// services
const invoiceService = require("../service/invoiceService");
const { sendMail } = require("../service/emailService");


exports.getMyOrders = async (req, res, next) => {
  try {
    const where = {
      userId: req.user.id
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: User,
              as: "product_owner",
              attributes: ["id", "fname", "lname", "email", "phone"]
            }
          ]
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

exports.getOrderRequest = async (req, res, next) => {
  try {
    const where = {
      productOwner: req.user.id
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    const orders = await OrderItem.findAll({
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
      const userId = req.user.id;
      const {
        shippingAddress,
        paymentInfo,
        products,
        deliveryFee,
        discount,
        totalAmount
      } = req.body;
      const orderSlug = `ORD-${utility.generateOrderId}`;
      const orderData = {
        orderSlug,
        userId: userId,
        deliveryFee,
        discount,
        totalAmount
      };
      const paymentData = {
        userId: userId,
        payment_reference: paymentInfo.reference,
        amount: paymentInfo.amount,
        payment_category: "Order"
      };

      await Payment.create(paymentData, { transaction: t });
      const orders = await Promise.all(
        products.map(async product => {
          const prodData = await Product.findByPk(product.productId, {
            attributes: [
              "id",
              "name",
              "creatorId",
              "price",
              "unit",
              "image",
              "description"
            ]
          });
          const amount = product.quantity * Number(prodData.price);
          const trackingId = `TRD-${utility.generateOrderId}`;
          return {
            status: "paid",
            trackingId,
            userId,
            productOwner: prodData.creatorId,
            amount,
            shippingAddress,
            paymentInfo,
            quantity: product.quantity,
            product: {
              id: prodData.id,
              name: prodData.name,
              price: prodData.price,
              unit: prodData.unit,
              image: prodData.image,
              description: prodData.description
            }
          };
        })
      );
      orderData.order_items = orders;
      const order = await Order.create(orderData, {
        include: [
          {
            model: OrderItem,
            as: "order_items"
          }
        ],
        transaction: t
      })

      // console.log(orderData.order_items);
      if (await invoiceService.createInvoice(orderData, userId)) {
        sendMail(
          'stephanyemmitty@gmail.com',
          `../uploads/invoice/${userId}.pdf`,
          "BOG Invoice")
      }
        
      return res.status(200).send({
        success: true,
        message: "Order Request submitted",
        order
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// generate invoice on save

exports.generateOrderInvoice = async (orders, res, next) => {
    try {
      invoiceService.createInvoice(orders, 'Holla4550')
    } catch (error) {
      return next(error);
    }
}

exports.updateOrder = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { orderId, status } = req.body;
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Invalid Order"
        });
      }

      const data = {
        status,
        ...req.body
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      return res.status(200).send({
        success: true,
        message: "Order updated"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateOrderRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { requestId, status } = req.body;
      const order = await OrderItem.findOne({
        where: { id: requestId },
        attributes: ["id"]
      });
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Invalid Order"
        });
      }

      const data = {
        status,
        ...req.body
      };
      console.log(data);
      await OrderItem.update(data, {
        where: { id: requestId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Order Request updated"
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: User,
              as: "product_owner",
              attributes: ["id", "fname", "lname", "email", "phone"]
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "fname", "lname", "email", "phone"]
            }
          ]
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
