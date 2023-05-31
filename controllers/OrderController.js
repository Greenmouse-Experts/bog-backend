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
const OrderReview = require("../models/order_reviews");
const Notification = require("../helpers/notification");
const Project = require("../models/Project");
const Transaction = require("../models/Transaction");
const Addresses = require("../models/addresses");
const {
  AdminNewOrderMailer,
  ClientUpdateOrderMailer,
  AdminUpdateOrderMailer,
  ClientOrderRefundRequestMailer,
  AdminOrderRefundRequestMailer,
  ClientOrderRefundMailer,
  AdminOrderRefundMailer,
} = require("../helpers/mailer/samples");

exports.getMyOrders = async (req, res, next) => {
  try {

    const {userType} = req.query;
    const where = {
      userId: req.user.id,
    };
    
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (userType) {
      where.userType = userType
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
          model: OrderReview,
          as: "orderReview",
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
        attributes: ["id", "email", "name", "fname", "lname", "userType"],
      });

      const {
        shippingAddress,
        paymentInfo,
        products,
        deliveryFee,
        discount,
        totalAmount,
        userType,
        deliveryaddressId
      } = req.body;

      // const profile = await UserService.getUserTypeProfile(user.userType, userId);
      // const { id } = profile;
   let address = await Addresses.findOne({
     where: { id: deliveryaddressId },
   });

   if (address == null){

    address = "No address"
   }
   
      const slug = Math.floor(190000000 + Math.random() * 990000000);
      const addresses = "hhh"
      const orderSlug = `BOG/ORD/${slug}`;
      const orderData = {
        orderSlug,
        userId,
        address,
        userType,
        deliveryFee,
        discount,
        totalAmount,
      };
      console.log(orderData)
      const paymentData = {
        userId,
        payment_reference: paymentInfo.reference,
        amount: totalAmount,
        payment_category: "Order",
      };

      // console.log(req.body);


 


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
          if (prodData === null) {
            return res.status(404).send({
              success: false,
              message: "Product not found!",
            });
          }

          const amount = product.quantity * Number(prodData.price);
          const trackingId = `TRD-${Math.floor(
            190000000 + Math.random() * 990000000
          )}`;

          // Notify product partner
          const mesg = `A user just bought ${product.quantity} of your product - ${prodData.name}`;
          const notifyType = "user";
          const { io } = req.app;
          await Notification.createNotification({
            type: notifyType,
            message: mesg,
            userId: prodData.creatorId,
          });
          io.emit(
            "getNotifications",
            await Notification.fetchUserNotificationApi()
          );

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
            address,
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

        // Get active product admins
        const product_admins = await User.findAll({
          where: { userType: "admin", level: 4, isActive: 1, isSuspended: 0 },
        });
        const super_admins = await User.findAll({
          where: { userType: "admin", level: 1, isActive: 1, isSuspended: 0 },
        });
        const _admins = [...product_admins, ...super_admins];

        await AdminNewOrderMailer(user, _admins, orders, files, {
          ref: orderSlug,
        });
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
        address,
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

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ["password"] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: "admin", level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: "admin", level: 1, isActive: 1, isSuspended: 0 },
      });
      const admins = [...project_admins, ...super_admins];

      // mailer for clients
      await ClientUpdateOrderMailer(user, status, {
        id: order.id,
        ref: order.orderSlug,
      });
      // mailer for admins
      await AdminUpdateOrderMailer(user, admins, status, {
        id: order.id,
        ref: order.orderSlug,
      });

      return res.status(200).send({
        success: true,
        message: "Order updated",
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.cancelOrder = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req._credentials;
      const { orderId } = req.params;
      const status = "cancelled";
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Invalid Order",
        });
      }

      if (order.status === "cancelled") {
        return res.status(200).json({
          success: true,
          message: "Order has already been cancelled!",
        });
      } else if (order.status !== "pending" || order.userId !== id) {
        return res.status(401).json({
          success: false,
          message: "Order cannot be cancelled!",
        });
      }

      const data = {
        status,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ["password"] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: "admin", level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: "admin", level: 1, isActive: 1, isSuspended: 0 },
      });
      const admins = [...project_admins, ...super_admins];

      // mailer for clients
      await ClientUpdateOrderMailer(user, status, {
        id: order.id,
        ref: order.orderSlug,
      });
      // mailer for admins
      await AdminUpdateOrderMailer(user, admins, status, {
        id: order.id,
        ref: order.orderSlug,
      });

      return res.status(200).send({
        success: true,
        message: `Order ${status}`,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.requestRefund = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req._credentials;
      const { orderId } = req.params;
      const refundStatus = "request refund";
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Invalid Order",
        });
      }

      if (order.refundStatus === "request refund") {
        return res.status(200).json({
          success: true,
          message: "Refund request has already been sent!",
        });
      }
      if (order.status !== "cancelled" || order.userId !== id) {
        return res.status(401).json({
          success: false,
          message: "Refund request on this order cannot be performed!",
        });
      }

      const data = {
        refundStatus,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ["password"] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: "admin", level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: "admin", level: 1, isActive: 1, isSuspended: 0 },
      });
      const admins = [...project_admins, ...super_admins];

      // mailer for clients
      await ClientOrderRefundRequestMailer(user, {
        id: order.id,
        ref: order.orderSlug,
      });

      // mailer for admins
      await AdminOrderRefundRequestMailer(user, admins, {
        id: order.id,
        ref: order.orderSlug,
      });

      return res.status(200).send({
        success: true,
        message: `Refund request has been sent successfully!`,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.refundOrder = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req._credentials;
      const { orderId } = req.params;
      const refundStatus = "refunded";
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Invalid Order",
        });
      }

      if (order.refundStatus === "refunded" && order.status === "cancelled") {
        return res.status(200).json({
          success: true,
          message: "Order has already been refunded!",
        });
      }
      if (
        order.status !== "cancelled" ||
        order.refundStatus !== "request refund"
      ) {
        return res.status(401).json({
          success: false,
          message: "Order cannot be refunded!",
        });
      }

      const data = {
        refundStatus,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ["password"] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: "admin", level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: "admin", level: 1, isActive: 1, isSuspended: 0 },
      });
      const admins = [...project_admins, ...super_admins];

      // mailer for clients
      await ClientOrderRefundMailer(user, {
        id: order.id,
        ref: order.orderSlug,
      });

      // mailer for admins
      await AdminOrderRefundMailer(user, admins, {
        id: order.id,
        ref: order.orderSlug,
      });

      return res.status(200).send({
        success: true,
        message: `Order has been refunded successfully!`,
      });
    } catch (error) {
      console.log(error);
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
