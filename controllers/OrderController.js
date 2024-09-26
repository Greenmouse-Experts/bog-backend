/* eslint-disable no-unused-vars */
require('dotenv').config();
const { Op } = require('sequelize');
const sequelize = require('../config/database/connection');
const User = require('../models/User');
const Order = require('../models/Order');
const utility = require('../helpers/utility');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const OrderItem = require('../models/OrderItem');
// services
const UserService = require('../service/UserService');
const invoiceService = require('../service/invoiceService2');
const { sendMail } = require('../service/attachmentEmailService');
const helpers = require('../helpers/message');
const helpTransaction = require('../helpers/transactions');
const ContactDetails = require('../models/ContactDetails');
const ProductReview = require('../models/Reviews');
const OrderReview = require('../models/order_reviews');
const Notification = require('../helpers/notification');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const Addresses = require('../models/addresses');
const {
  AdminNewOrderMailer,
  ClientUpdateOrderMailer,
  AdminUpdateOrderMailer,
  ClientOrderRefundRequestMailer,
  AdminOrderRefundRequestMailer,
  ClientOrderRefundMailer,
  AdminOrderRefundMailer,
} = require('../helpers/mailer/samples');
const ProductEarning = require('../models/ProductEarnings');
const ProductCategory = require('../models/ProductCategory');
const DeliveryAddresses = require('../models/delivery_addresses');

exports.getMyOrders = async (req, res, next) => {
  try {
    const { userType } = req.query;
    const where = {
      userId: req.user.id,
    };

    if (req.query.status) {
      where.status = req.query.status;
    }
    if (userType) {
      where.userType = userType;
    }

    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ContactDetails,
          as: 'contact',
        },
        {
          model: OrderItem,
          as: 'order_items',
          include: [
            {
              model: User,
              as: 'product_owner',
              attributes: ['id', 'fname', 'lname', 'email', 'phone'],
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
          as: 'contact',
        },
        {
          model: OrderItem,
          as: 'order_items',
          include: [
            {
              model: User,
              as: 'product_owner',
              attributes: ['id', 'fname', 'lname', 'email', 'phone'],
            },
          ],
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'fname', 'lname', 'email', 'phone', 'photo'],
        },
        {
          model: OrderReview,
          as: 'orderReview',
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
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fname', 'lname', 'email', 'phone', 'photo'],
        },
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: ContactDetails,
              as: 'contact',
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
        attributes: [
          'id',
          'email',
          'name',
          'fname',
          'lname',
          'userType',
          'phone',
          'address',
          'state',
          'city',
          'street',
        ],
      });
      let {
        shippingAddress,
        paymentInfo,
        products,
        deliveryFee,
        discount,
        totalAmount,
        userType,
        deliveryaddressId,
        insuranceFee,
      } = req.body;

      if (!user.address && !user.city && !user.state) {
        return res.status(400).send({
          success: false,
          message: 'Home address has not been added.',
        });
      }

      const deliveryAddress = await DeliveryAddresses.findOne({
        where: { ...shippingAddress, user_id: userId },
      });

      if (!deliveryAddress) {
        await DeliveryAddresses.create({ ...shippingAddress, user_id: userId });
      }

      let deliveryaddress = await Addresses.findOne({
        where: { id: deliveryaddressId },
      });
      if (deliveryaddress == null) {
        deliveryaddress = 'No address';
      }

      if (userType == null || userType == 'undefined') {
        userType = user.userType;
      }
      shippingAddress.deliveryaddress = deliveryaddress;

      const slug = Math.floor(190000000 + Math.random() * 990000000);
      const orderSlug = `BOG/ORD/${slug}`;
      const orderData = {
        orderSlug,
        userId,
        userType,
        deliveryFee,
        discount,
        totalAmount,
        insuranceFee,
      };
      const paymentData = {
        userId,
        payment_reference: paymentInfo.reference,
        amount: totalAmount,
        payment_category: 'Order',
      };

      const profile = await UserService.getUserTypeProfile(userType, userId);

      await Payment.create(paymentData, { transaction: t });
      const contact = {
        ...shippingAddress,
        userId,
      };
      let productEarnings = [];
      const orders = await Promise.all(
        products.map(async (product) => {
          const prodData = await Product.findOne({
            where: { id: product.productId },
            attributes: [
              'id',
              'name',
              'creatorId',
              'price',
              'unit',
              'image',
              'description',
              'min_qty',
              'max_qty',
            ],
            include: [{ model: ProductCategory, as: 'category' }],
          });

          // console.log(prodData);
          if (prodData === null) {
            return res.status(404).send({
              success: false,
              message: `Product with the ID of ${product.productId} not found!`,
            });
          }

          if (
            !(
              product.quantity >= prodData.min_qty &&
              product.quantity <= prodData.max_qty
            )
          ) {
            return res.status(422).send({
              success: false,
              message:
                'The quantity of item requested for cannot be processed.',
            });
          }

          const amount = product.quantity * Number(prodData.price);
          const trackingId = `TRD-${Math.floor(
            190000000 + Math.random() * 990000000
          )}`;

          //define product earning for every product
          const p = {
            productOwnerId: prodData.creatorId,
            amount,
            qty: product.quantity,
          };
          productEarnings.push(p);

          const userDetails = await UserService.findUserById(
            prodData.creatorId
          );

          // Notify product partner
          const mesg = `A user just bought ${product.quantity} of your product - ${prodData.name}`;
          const notifyType =
            userDetails.userType === 'vendor' ? 'user' : 'admin';
          const { io } = req.app;
          const partner_profile = await UserService.getUserTypeProfile(
            'product_partner',
            prodData.creatorId
          );
          await Notification.createNotification({
            type: notifyType,
            message: mesg,
            userId:
              userDetails.userType === 'vendor'
                ? partner_profile.id
                : undefined,
          });
          io.emit(
            'getNotifications',
            await Notification.fetchUserNotificationApi()
          );

          return {
            status: 'paid',
            trackingId,
            userId,

            ownerId,
            productOwner: prodData.creatorId,
            amount,
            shippingAddress,
            paymentInfo,
            quantity: product.quantity,
            productEarnings,
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
      orderData.user = user;
      orderData.contact = contact;
      orderData.productEarnings = productEarnings;
      const order = await Order.create(orderData, {
        include: [
          {
            model: OrderItem,
            as: 'order_items',
            // include: [
            //   {
            //     model: ProductEarning,
            //     as: "productEarnings",
            //   },
            // ],
          },
          {
            model: ContactDetails,
            as: 'contact',
          },
        ],
        transaction: t,
      });

      for (let i = 0; i < productEarnings.length; i++) {
        const prode = ProductEarning.create({
          orderId: order.id,
          orderItemId: order.order_items[i].id,
          productOwnerId: productEarnings[i].productOwnerId,
          amount: productEarnings[i].amount,
          qty: productEarnings[i].qty,
        });
      }

      orderData.slug = orderSlug;
      await helpTransaction.saveTxn(orderData, 'Products', userType);
      orderData.orderSlug = slug;
      const invoice = await invoiceService.createInvoice(orderData, user);
      if (invoice) {
        const files = [
          {
            path: `uploads/${slug}.pdf`,
            filename: `${slug}.pdf`,
          },
        ];
        let deliveryTime = 'Not stated';
        if (
          orderData.order_items[0].shippingAddress.deliveryaddress !==
          'No address'
        ) {
          deliveryTime =
            orderData.order_items[0].shippingAddress.deliveryaddress
              .delivery_time;
        }
        const message = helpers.invoiceMessage(user.name, deliveryTime);
        sendMail(user.email, message, 'BOG Invoice', files);

        // Get active product admins
        const product_admins = await User.findAll({
          where: { userType: 'admin', level: 4, isActive: 1, isSuspended: 0 },
        });
        const super_admins = await User.findAll({
          where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
        });
        const _admins = [...product_admins, ...super_admins];

        await AdminNewOrderMailer(user, _admins, orders, files, {
          ref: orderSlug,
        });
      }

      // Notify buyer (client)
      const mesgUser = `You just ordered for ${orders.length} item${
        orders.length > 1 ? 's' : ''
      } [${orderSlug}]`;
      const notifyTypeU = 'user';
      const { io } = req.app;

      await Notification.createNotification({
        type: notifyTypeU,
        message: mesgUser,
        userId: profile.id,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchUserNotificationApi()
      );

      // Notify admin
      const mesg = `A new order was made by ${
        user.name ? user.name : `${user.fname} ${user.lname}`
      }`;
      const notifyType = 'admin';
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchAdminNotification({ userId })
      );

      // save the details of the transaction
      return res.status(200).send({
        success: true,
        message: 'Order Request submitted',
        order,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getDeliveryAddresses = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req._credentials;
      const delivery_address = await DeliveryAddresses.findAll({
        where: { user_id: id },
      });

      return res.status(200).send({
        success: true,
        data: delivery_address,
      });
    } catch (error) {
      return next(error);
    }
  });
};

exports.removeDeliveryAddress = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { deliveryId } = req.params;

      const d_address = await DeliveryAddresses.findOne({
        where: { id: deliveryId },
      });
      if (!d_address) {
        return res
          .status(404)
          .send({ success: false, message: 'Delivery address not found.' });
      }

      await DeliveryAddresses.destroy({ where: { id: deliveryId } });

      return res
        .status(200)
        .send({ success: true, message: 'Delivery address has been deleted.' });
    } catch (error) {
      return next(error);
    }
  });
};

exports.updateDeliveryAddress = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { deliveryId } = req.params;

      const d_address = await DeliveryAddresses.findOne({
        where: { id: deliveryId },
      });
      if (!d_address) {
        return res
          .status(404)
          .send({ success: false, message: 'Delivery address not found.' });
      }

      await DeliveryAddresses.update(req.body, { where: { id: deliveryId } });

      return res.status(200).send({
        success: true,
        message: 'Delivery address has been updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  });
};
// generate invoice on save

exports.generateOrderInvoice = async (orders, res, next) => {
  try {
    invoiceService.createInvoice(orders, 'Holla4550');
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
          message: 'Invalid Order',
        });
      }

      const user_details = await UserService.findUser({ id: order.userId });
      if (!user_details) {
        return res.status(404).send({
          success: false,
          message: 'User account not found!',
        });
      }

      const profile = await UserService.getUserTypeProfile(
        user_details.userType,
        user_details.id
      );
      if (!profile) {
        return res.status(404).send({
          success: false,
          message: 'User profile not found!',
        });
      }

      const data = {
        status,
        ...req.body,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: 'admin', level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
      });
      const admins = [...project_admins, ...super_admins];

      // Notify buyer (client)
      const mesgUser = `Your order [${order.orderSlug}] has been ${
        status === 'pending' ? 'updated to pending' : status
      }`;
      const notifyTypeU = 'user';
      const { io } = req.app;

      await Notification.createNotification({
        type: notifyTypeU,
        message: mesgUser,
        userId: profile.id,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchUserNotificationApi()
      );

      // Notify admin
      const mesg = `${user_details.userType} ${user_details.name}'s order [${
        order.orderSlug
      }] has been ${status === 'pending' ? 'updated to pending' : status}`;
      const notifyType = 'admin';
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
      });
      io.emit(
        'getNotifications',
        await Notification.fetchAdminNotification({ userId: user_details.id })
      );

      // mailer for clients
      await ClientUpdateOrderMailer(user_details, status, {
        id: order.id,
        ref: order.orderSlug,
      });
      // mailer for admins
      await AdminUpdateOrderMailer(user_details, admins, status, {
        id: order.id,
        ref: order.orderSlug,
      });

      return res.status(200).send({
        success: true,
        message: 'Order updated',
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.cancelOrder = async (req, res, next) => {
  // sequelize.transaction(async (t) => {
  try {
    const { id } = req._credentials;
    const { orderId } = req.params;
    const status = 'cancelled';
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Order',
      });
    }

    if (order.status === 'cancelled') {
      return res.status(200).json({
        success: true,
        message: 'Order has already been cancelled!',
      });
    } else if (order.status !== 'pending' || order.userId !== id) {
      return res.status(401).json({
        success: false,
        message: 'Order cannot be cancelled!',
      });
    }

    const data = {
      status,
    };
    await Order.update(data, { where: { id: orderId } });
    // await Order.update(data, { where: { id: orderId }, transaction: t });

    const user = await User.findOne({
      where: { id: order.userId },
      attributes: { exclude: ['password'] },
    });

    // Get active project admins
    const project_admins = await User.findAll({
      where: { userType: 'admin', level: 5, isActive: 1, isSuspended: 0 },
    });
    const super_admins = await User.findAll({
      where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
    });
    const admins = [...project_admins, ...super_admins];

    // Notify admin
    const mesg = `${user.userType} ${user.name} has cancelled a ${order.status} order [${order.orderSlug}]`;
    const notifyType = 'admin';
    await Notification.createNotification({
      type: notifyType,
      message: mesg,
    });
    const { io } = req.app;
    io.emit(
      'getNotifications',
      await Notification.fetchAdminNotification({ userId: user.id })
    );

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
    // t.rollback();
    return next(error);
  }
  // });
};

exports.requestRefund = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req._credentials;
      const { orderId } = req.params;
      const refundStatus = 'request refund';
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Invalid Order',
        });
      }

      if (order.refundStatus === 'request refund') {
        return res.status(200).json({
          success: true,
          message: 'Refund request has already been sent!',
        });
      }
      if (order.status !== 'cancelled' || order.userId !== id) {
        return res.status(401).json({
          success: false,
          message: 'Refund request on this order cannot be performed!',
        });
      }

      const data = {
        refundStatus,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ['password'] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: 'admin', level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
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
      const refundStatus = 'refunded';
      const order = await Order.findOne({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Invalid Order',
        });
      }

      if (order.refundStatus === 'refunded' && order.status === 'cancelled') {
        return res.status(200).json({
          success: true,
          message: 'Order has already been refunded!',
        });
      }
      if (
        order.status !== 'cancelled' ||
        order.refundStatus !== 'request refund'
      ) {
        return res.status(401).json({
          success: false,
          message: 'Order cannot be refunded!',
        });
      }

      const data = {
        refundStatus,
      };
      await Order.update(data, { where: { id: orderId }, transaction: t });

      const user = await User.findOne({
        where: { id: order.userId },
        attributes: { exclude: ['password'] },
      });

      // Get active project admins
      const project_admins = await User.findAll({
        where: { userType: 'admin', level: 5, isActive: 1, isSuspended: 0 },
      });
      const super_admins = await User.findAll({
        where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
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
        attributes: ['id'],
      });
      if (!order) {
        return res.status(404).send({
          success: false,
          message: 'Invalid Order',
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
        message: 'Order Request updated',
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
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ContactDetails,
          as: 'contact',
        },
        {
          model: OrderItem,
          as: 'order_items',
          include: [
            {
              model: User,
              as: 'product_owner',
              attributes: ['id', 'fname', 'lname', 'email', 'phone'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fname', 'lname', 'email', 'phone'],
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
