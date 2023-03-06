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
const invoiceService = require("../service/invoiceService2");
const { sendMail } = require("../service/attachmentEmailService");
const helpers = require("../helpers/message");
const helpTransaction = require("../helpers/transactions");
const ContactDetails = require("../models/ContactDetails");
const ProductReview = require("../models/Reviews");
const Notification = require("../helpers/notification");
const Project = require("../models/Project");
const Transaction = require("../models/Transaction");

exports.getMyOrders = async (req, res, next) => {
  try {
    const where = {
      userId: req.user.id,
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ContactDetails,
          as: "contact",
        },
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: User,
              as: "product_owner",
              attributes: ["id", "fname", "lname", "email", "phone"],
            },
          ],
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const where = {
      id: req.params.orderId,
    };

    const orders = await Order.findOne({
      where,
      include: [
        {
          model: ContactDetails,
          as: "contact",
        },
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: User,
              as: "product_owner",
              attributes: ["id", "fname", "lname", "email", "phone"],
            },
          ],
        },
        {
          model: User,
          as: "client",
          attributes: ["id", "fname", "lname", "email", "phone", "photo"],
        },
        {
          model: ProductReview,
          as: "review",
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getOrderRequest = async (req, res, next) => {
  try {
    const where = {
      productOwner: req.user.id,
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
          attributes: ["id", "fname", "lname", "email", "phone", "photo"],
        },
        {
          model: Order,
          as: "order",
          include: [
            {
              model: ContactDetails,
              as: "contact",
            },
          ],
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};


exports.createOrder = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const ownerId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: ["email", "name", "fname", "lname"],
      });
      const {
        shippingAddress,
        paymentInfo,
        products,
        deliveryFee,
        discount,
        totalAmount,
      } = req.body;
      const slug = Math.floor(190000000 + Math.random() * 990000000);
      const orderSlug = `BOG/ORD/${slug}`;
      const orderData = {
        orderSlug,
        userId,
        deliveryFee,
        discount,
        totalAmount,
      };
      const paymentData = {
        userId,
        payment_reference: paymentInfo.reference,
        amount: totalAmount,
        payment_category: "Order",
      };

      console.log(req.body);

      await Payment.create(paymentData, { transaction: t });
      const contact = {
        ...shippingAddress,
        userId,
      };
      const orders = await Promise.all(
        products.map(async (product) => {
          const prodData = await Product.findByPk(product.productId, {
            attributes: [
              "id",
              "name",
              "creatorId",
              "price",
              "unit",
              "image",
              "description",
            ],
          });
          const amount = product.quantity * Number(prodData.price);
          const trackingId = `TRD-${Math.floor(
            190000000 + Math.random() * 990000000
          )}`;
          return {
            status: "paid",
            trackingId,
            userId,
            ownerId,
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
              description: prodData.description,
            },
          };
        })
      );

      orderData.order_items = orders;
      orderData.contact = contact;
      const order = await Order.create(orderData, {
        include: [
          {
            model: OrderItem,
            as: "order_items",
          },
          {
            model: ContactDetails,
            as: "contact",
          },
        ],
        transaction: t,
      });

      orderData.slug = orderSlug;
      await helpTransaction.saveTxn(orderData, "Products");
      orderData.orderSlug = slug;
      const invoice = await invoiceService.createInvoice(orderData, user);
      if (invoice) {
        const files = [
          {
            path: `uploads/${slug}.pdf`,
            filename: `${slug}.pdf`,
          },
        ];
        const message = helpers.invoiceMessage(user.name);
        sendMail(user.email, message, "BOG Invoice", files);
      }

      const mesg = `A new order was made by ${
        user.name ? user.name : `${user.fname} ${user.lname}`
      }`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      // save the details of the transaction
      return res.status(200).send({
        success: true,
        message: "Order Request submitted",
        order,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

// generate invoice on save

exports.generateOrderInvoice = async (orders, res, next) => {
  try {
    invoiceService.createInvoice(orders, "Holla4550");
    return true;
  } catch (error) {
    return next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { orderId, status } = req.body;
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Invalid Order",
        });
      }

      const data = {
        status,
        ...req.body,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      return res.status(200).send({
        success: true,
        message: "Order updated",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateOrderRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { requestId, status } = req.body;
      const order = await OrderItem.findOne({
        where: { id: requestId },
        attributes: ["id"],
      });
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Invalid Order",
        });
      }

      const data = {
        status,
        ...req.body,
      };
      await OrderItem.update(data, {
        where: { id: requestId },
        transaction: t,
      });

      return res.status(200).send({
        success: true,
        message: "Order Request updated",
      });
    } catch (error) {
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
          model: ContactDetails,
          as: "contact",
        },
        {
          model: OrderItem,
          as: "order_items",
          include: [
            {
              model: User,
              as: "product_owner",
              attributes: ["id", "fname", "lname", "email", "phone"],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "fname", "lname", "email", "phone"],
            },
          ],
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};
