/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Category = require("../models/ProductCategory");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");
// const cloudinary = require("../helpers/cloudinary");
const Reviews = require("../models/Reviews");
const Notification = require("../helpers/notification");
const OrderItem = require("../models/OrderItem");
const Order = require("../models/Order");
const ProductEarning = require("../models/ProductEarnings");
const ProductPartner = require("../models/ProductPartner");
const TransactionPending = require("../models/TransactionPending");
const { getUserTypeProfile, findUserById } = require("../service/UserService");
const KycFinancialData = require("../models/KycFinancialData");
const Transaction = require("../models/Transaction");
const { Service } = require("../helpers/flutterwave");
const {
  ServicePartnerMailerForProjectPayout,
  AdminProjectPayoutMailer,
} = require("../helpers/mailer/samples");

exports.notifyAdmin = async ({ userId, message, req }) => {
  const notifyType = "admin";
  const { io } = req.app;
  await Notification.createNotification({
    type: notifyType,
    message,
    userId,
  });
  io.emit("getNotifications", await Notification.fetchAdminNotification());
};

exports.getProducts = async (req, res, next) => {
  try {
    const where = {
      status: "approved",
      showInShop: true,
    };
    let _orders = await Order.findAll();

    let products = JSON.parse(
      JSON.stringify(
        await Product.findAll({
          where,
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "name", "email", "phone", "photo"],
            },
            {
              model: Reviews,
              as: "review",
            },
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "description"],
            },
            {
              model: ProductImage,
              as: "product_image",
              attributes: ["id", "name", "image", "url"],
            },
          ],
          order: [["createdAt", "DESC"]],
        })
      )
    );

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const orders = JSON.parse(
        JSON.stringify(
          await OrderItem.findAll({
            where: {
              productOwner: product.creatorId,
              product: { [Op.like]: `%${product.id}%` },
            },
          })
        )
      );

      let review = 0;
      let total = 0;
      if (product.review.length > 0) {
        product.review.forEach((rev) => {
          review += rev.star;
          total += 5;
        });
      }

      let orderTotal = 0;
      for (let index2 = 0; index2 < orders.length; index2++) {
        const order_ = orders[index2];
        const orderTrx = _orders.filter(
          (_order) =>
            _order.id === order_.orderId && _order.status !== "cancelled"
        );
        if (orderTrx.length > 0) {
          orderTotal += order_.quantity;
        }
      }
      let star1 = review > 0 ? (review / total) * 5 : 0;
      let star = (Math.round(star1) * 10) / 10;
      products[index] = {
        ...product,
        orderTotal,
        in_stock: orderTotal < parseInt(product.quantity) ? true : false,
        remaining: parseInt(product.quantity) - orderTotal,
        star: star,
      };
    }
    return res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSimilarProducts = async (req, res, next) => {
  try {
    const where = {
      status: "approved",
      showInShop: true,
      categoryId: req.query.category,
    };
    const products = await Product.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"],
        },
        {
          model: Reviews,
          as: "product_reviews",
          attributes: ["id", "star", "reviews", "userId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    const data = await Promise.all(
      categories.map(async (category) => {
        const where = {
          categoryId: category.id,
          status: "approved",
        };
        const count = await Product.count({ where });
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          unit: category.unit,
          totalProducts: count,
        };
      })
    );
    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.categoryId },
    });
    return res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    return next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { name, description, unit } = req.body;
      const [category, created] = await Category.findOrCreate({
        where: { name, description, unit },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        data: category,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.updateCategory = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { name, description, unit } = req.body;
      const { categoryId } = req.params;
      const category = await Category.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category",
        });
      }
      await Category.update(
        {
          name,
          description,
          unit,
        },
        { where: { id: categoryId }, transaction: t }
      );
      return res.status(200).send({
        success: true,
        data: category,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteCategory = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category",
        });
      }
      await Category.destroy({ where: { id: categoryId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.createProduct = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { categoryId, name, price, quantity, unit, description } = req.body;
      const creatorId = req.user.id;
      const request = {
        categoryId,
        name,
        price,
        quantity,
        unit,
        description,
        creatorId,
        status: req.body.status,
      };

      const photos = [];
      for (let i = 0; i < req.files.length; i++) {
        // const result = await cloudinary.uploader.upload(req.files[i].path);
        // const docPath = result.secure_url;
        const url = `${process.env.APP_URL}/${req.files[i].path}`;
        photos.push({
          name: req.files[i].originalname,
          image: req.files[i].path,
          creatorId,
          url,
        });
      }
      if (photos.length > 0) {
        request.image = photos[0].url;
        request.product_image = photos;
      }
      const product = await Product.create(request, {
        transaction: t,
        include: [
          {
            model: ProductImage,
            as: "product_image",
          },
        ],
      });

      const mesg = `A new Product was created`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.status(200).send({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateProduct = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { productId } = req.params;
      const request = req.body;
      const creatorId = req.user.id;
      const product = await Product.findByPk(productId, {
        attributes: ["id"],
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product",
        });
      }

      if (req.files.length > 0) {
        const photos = [];
        for (let i = 0; i < req.files.length; i++) {
          // const result = await cloudinary.uploader.upload(req.files[i].path);
          // const docPath = result.secure_url;
          const url = `${process.env.APP_URL}/${req.files[i].path}`;
          photos.push({
            name: req.files[i].originalname,
            image: req.files[i].path,
            creatorId,
            productId,
            url,
          });
        }
        const images = await ProductImage.findAll({
          where: { productId },
          attributes: ["id"],
        });
        if (images.length > 0) {
          const Ids = images.map((img) => img.id);
          await ProductImage.destroy({ where: { id: Ids }, transaction: t });
        }
        await ProductImage.bulkCreate(photos, { transaction: t });
        request.image = photos[0].image;
      }

      await Product.update(request, {
        where: { id: productId },
        // transaction: t
      });

      const result = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email", "phone", "photo"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "description"],
          },
          {
            model: ProductImage,
            as: "product_image",
            attributes: ["id", "name", "image", "url"],
          },
        ],
      });

      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const creatorId = req.user.id;
    const where = {
      creatorId,
    };
    if (req.query.status) {
      where.status = req.query.status;
    }

    let _orders = await Order.findAll();

    const products = JSON.parse(
      JSON.stringify(
        await Product.findAll({
          where,
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name", "description"],
            },
            {
              model: ProductImage,
              as: "product_image",
              attributes: ["id", "name", "image", "url"],
            },
          ],
          order: [["createdAt", "DESC"]],
        })
      )
    );

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const orders = JSON.parse(
        JSON.stringify(
          await OrderItem.findAll({
            where: {
              productOwner: product.creatorId,
              product: { [Op.like]: `%${product.id}%` },
            },
          })
        )
      );

      let orderTotal = 0;
      for (let index2 = 0; index2 < orders.length; index2++) {
        const order_ = orders[index2];
        const orderTrx = _orders.filter(
          (_order) =>
            _order.id === order_.orderId && _order.status !== "cancelled"
        );
        if (orderTrx.length > 0) {
          orderTotal += order_.quantity;
        }
      }

      products[index] = {
        ...product,
        orderTotal,
        in_stock: orderTotal < parseInt(product.quantity) ? true : false,
        remaining: parseInt(product.quantity) - orderTotal,
      };
    }

    return res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSingleProducts = async (req, res, next) => {
  try {
    let _orders = await Order.findAll();
    const product = await Product.findOne({
      where: { id: req.params.productId },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"],
        },
      ],
    });

    const orders = JSON.parse(
      JSON.stringify(
        await OrderItem.findAll({
          where: {
            productOwner: product.creatorId,
            product: { [Op.like]: `%${product.id}%` },
          },
        })
      )
    );

    let orderTotal = 0;
    for (let index2 = 0; index2 < orders.length; index2++) {
      const order_ = orders[index2];
      const orderTrx = _orders.filter(
        (_order) =>
          _order.id === order_.orderId && _order.status !== "cancelled"
      );
      if (orderTrx.length > 0) {
        orderTotal += order_.quantity;
      }
    }

    const review_details = await Reviews.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, as: "client" }],
    });
    return res.status(200).send({
      success: true,
      data: {
        ...product.toJSON(),
        reviews: review_details,
        orders: orderTotal,
        in_stock: orderTotal < parseInt(product.quantity) ? true : false,
        remaining: parseInt(product.quantity) - orderTotal,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { productId } = req.params;
      const creatorId = req.user.id;

      const product = await Product.findOne({
        where: { id: productId },
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product",
        });
      }
      // if (creatorId !== product.creatorId) {
      //   return res.status(400).send({
      //     success: false,
      //     message: "Unauthorised request"
      //   });
      // }
      // if (product.showInShop || product.status === "approved") {
      //   return res.status(400).send({
      //     success: false,
      //     message: "Product in store can't be deleted"
      //   });
      // }
      await Product.destroy({ where: { id: productId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteOldProduct = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const products = await Product.findAll({ order: [["createdAt", "ASC"]] });
      const data = products
        .map((product) => {
          if (product.image.startsWith("upload")) {
            return product;
          }
          return null;
        })
        .filter((prod) => prod != null);
      const Ids = data.map((product) => product.id);

      await Product.destroy({ where: { id: Ids }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Product deleted successfully",
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.addProductToShop = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { productId } = req.params;

      const product = await Product.findOne({
        where: { id: productId },
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product",
        });
      }
      if (product.status === "disapproved") {
        return res.status(400).send({
          success: false,
          message:
            "This Product has been disapproved by admin. Please update or create a new one",
        });
      }
      await Product.update(
        { status: "in_review" },
        { where: { id: productId }, transaction: t }
      );

      const mesg = `A product (${product.name}) has been sent for reviewed to be allowed in shop`;
      const userId = product.creatorId;
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
        message: "Product sent for review. Please wait for admin approval",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getProductsForAdmin = async (req, res, next) => {
  try {
    const where = {
      [Op.or]: [
        { status: "in_review" },
        { status: "approved" },
        { status: "disapproved" },
      ],
    };
    if (req.query.status) {
      where.status = req.query.status;
    }
    const products = await Product.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"],
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    return res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    return next(error);
  }
};

exports.approveProduct = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { productId, status } = req.body;

      const product = await Product.findOne({
        where: { id: productId },
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product",
        });
      }
      const data = {
        status,
      };
      if (status === "approved") {
        data.showInShop = true;
      }
      await Product.update(data, { where: { id: productId }, transaction: t });
      const mesg = `Your product ${product.name} has been reviewed and approved`;
      const userId = product.creatorId;
      const notifyType = "user";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        userId,
      });
      io.emit(
        "getNotifications",
        await Notification.fetchUserNotificationApi({ userId })
      );

      return res.status(200).send({
        success: true,
        message: `Product ${status} successfully `,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.transferToProductPartner = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { bank_code, account_number, bank_name } = req.body;
      const product = await Product.findOne({ where: { id: productId } });
      if (!product || product == null || product == "undefined") {
        console.log(product);
        return res.status(404).send({
          success: false,
          message: "No Product!",
        });
      }
      const pEarnings = await ProductEarning.findAll({
        where: { productOwnerId: product.creatorId, status: "pending" },
      });
      if (!pEarnings || pEarnings == null || pEarnings == "undefined") {
        return res.status(404).send({
          success: false,
          message: "Product hasnt been bought or all earnings has been paid!",
        });
      }
      console.log(pEarnings);
      //  return res.status(200).send({
      //    success: true,
      //    data: pEarnings,
      //  });
      let amount = 0;

      for (let i = 0; i < pEarnings.length; i++) {
        amount = amount + Number(pEarnings[i].amount);
      }
      console.log(amount);

      // Check to see if amount is not greater than the bid from the service partner
      // if (amount > project.estimatedCost) {
      //   return res.status(422).send({
      //     success: false,
      //     message: "Amount cannot be processed!",
      //   });
      // }

      const paymentReference = `TR-${Math.floor(
        190000000000 + Math.random() * 990000000000
      )}`;

      if (product.creatorId !== null) {
        const product_partner_details = await ProductPartner.findOne({
          where: { userId: product.creatorId },
        });

        console.log(product_partner_details);
        const profile = await getUserTypeProfile(
          "product_partner",
          product_partner_details.userId
        );
        const data = {
          ...req.body,
          userId: profile.id,
        };
        let myFinancial = await KycFinancialData.findOne({
          where: { userId: profile.id },
        });
        let _product_partner = await User.findOne({
          where: { id: product_partner_details.userId },
        });
        console.log(product);

        if (_product_partner !== null) {
          let narration = `Transfer to product partner ${profile.company_name} [${product.description}]`;

          if (myFinancial !== null) {
            // console.log(_service_partner)
            // Trigger transfer
            // const transferResponse = await Service.Flutterwave.transfer(
            //   account_number,
            //   bank_code,
            //   amount,
            //   narration,
            //   'NGN',
            //   paymentReference
            // );
            const transfer = {
              account_number: account_number,
              bank_code: bank_code,
              amount: amount,
              narration: narration,
              NGN: "NGN",
              paymentReference: paymentReference,
            };

            // if(transferResponse.status === 'error'){
            //   return res.status(400).json({
            //     success: false,
            //     message: "Transfer failed!"
            //   })
            // }
            const slug = Math.floor(190000000 + Math.random() * 990000000);
            const TransactionId = `BOG/TXN/PROD/${slug}`;

            console.log(product);

            const transaction = {
              TransactionId: TransactionId,
              userId: null,
              status: "PAID",
              type: "Product Payout to product partner",
              amount: amount,
              paymentReference: paymentReference,
              description: narration,
              product: product,
            };

            const trxData = {
              TransactionId: TransactionId,
              userId: null,
              transaction,
              transfer: transfer,
            };

            const response = await TransactionPending.create(trxData);

            const user = await User.findByPk(userId, {
              attributes: ["name", "email", "id", "userType"],
            });
            const reqData = {
              req,
              userId: null,
              message: `Admin has initiated a payout of NGN ${amount} to product partner ${profile.company_name} [${product.description}]`,
            };
            await this.notifyAdmin(reqData);

            // Get active project admins
            const product_admins = await User.findAll({
              where: {
                userType: "admin",
                level: 4,
                isActive: 1,
                isSuspended: 0,
              },
            });
            const super_admins = await User.findAll({
              where: {
                userType: "admin",
                level: 1,
                isActive: 1,
                isSuspended: 0,
              },
            });
            const admins = [...product_admins, ...super_admins];

            // // Client mailer
            // await ServicePartnerMailerForProjectPayout(
            //   { email: _service_partner.email, first_name: _service_partner.fname },
            //   amount,
            //   project
            // );
            // // Admins mailer
            // await AdminProjectPayoutMailer(
            //   {company_name: profile.company_name},
            //   admins,
            //   amount,
            //   project
            // );

            return res.status(200).send({
              success: true,
              message: "Transfer Initiation was successful!",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.approveTransferToProductPartner = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      // const { tranactionId } = req.body;
      const pendingTransaction = await TransactionPending.findOne({
        where: { id },
      });
      if (!pendingTransaction || pendingTransaction == null) {
        return res.status(404).send({
          success: false,
          message: "Invalid Pending Transaction!",
        });
      }

      const prevTransfer = await Transaction.findOne({
        where: { TransactionId: pendingTransaction.TransactionId },
      });
      if (prevTransfer !== null) {
        console.log(prevTransfer);
        return res.status(404).send({
          success: false,
          message: "Transaction Already Approved and Completed!",
        });
      }

      let user = await findUserById(userId);
      if (!user || user == null) {
        return res.status(404).send({
          success: false,
          message: "No user found!",
        });
      }
      const userLevel = user.level;
      const transaction = pendingTransaction.transaction;
      const transfer = pendingTransaction.transfer;

      const {
        TransactionId,
        status,
        type,
        amount,
        paymentReference,
        description,
        product,
      } = transaction;
      const { account_number, bank_code, narration } = transfer;
      console.log(product.createdAt);

      const pEarnings = await ProductEarning.findAll({
        where: {
          productOwnerId: product.creatorId,
          [Op.and]: [
            sequelize.where(
              sequelize.fn("date", sequelize.col("createdAt")),
              "<",
              sequelize.fn(
                "DATE_SUB",
                '2023-06-09 04:32:03',
                sequelize.literal("INTERVAL " + 7 + " DAY")
              )
            ),
          ],
          status: "pending",
        },
      });
      console.log(pEarnings);

      if (!pEarnings || user == pEarnings) {
        return res.status(404).send({
          success: false,
          message: "No user found!",
        });
      }

      if (userLevel == 1 || userLevel == 3) {
        if (userLevel == 3 && pendingTransaction.superadmin == false) {
          return res.status(404).send({
            success: false,
            message: "Cant approve transfer until super admin approves it",
          });
        } else if (userLevel == 3 && pendingTransaction.superadmin == true) {
          const product_partner_details = await ProductPartner.findOne({
            where: { userId: product.creatorId },
          });
          const profile = await getUserTypeProfile(
            "product_partner",
            product_partner_details.userId
          );
          const data = {
            ...req.body,
            userId: profile.id,
          };
          let myFinancial = await KycFinancialData.findOne({
            where: { userId: profile.id },
          });
          let _product_partner = await User.findOne({
            where: { id: product_partner_details.userId },
          });

          if (_product_partner !== null) {
            if (myFinancial !== null) {
              console.log(_product_partner);
              // Trigger transfer
              const transferResponse = await Service.Flutterwave.transfer(
                account_number,
                bank_code,
                amount,
                narration,
                "NGN",
                paymentReference
              );

              if (transferResponse.status === "error") {
                return res.status(400).json({
                  success: false,
                  message: "Transfer failed!",
                });
              }
              const trxData = {
                TransactionId,
                userId: null,
                status: "PAID",
                type: "Product Payout to product partner",
                amount,
                paymentReference,
                description: narration,
              };

              const response = await Transaction.create(trxData, { t });

              const user = await User.findByPk(userId, {
                attributes: ["name", "email", "id", "userType"],
              });
              const reqData = {
                req,
                userId: null,
                message: `Admin has made a payout of NGN ${amount} to product partner ${profile.company_name} [${product.description}]`,
              };
              await this.notifyAdmin(reqData);

              //update fin admin approve to true when transfer complete
              await TransactionPending.update(
                { financialadmin: true },
                { where: { id } }
              );

              //update transactio from pending to paid

              await ProductEarning.update({status: 'paid'},{
                where: {
                  productOwnerId: product.creatorId,
                  [Op.and]: [
                    sequelize.where(
                      sequelize.fn("date", sequelize.col("createdAt")),
                      "<",
                      sequelize.fn(
                        "DATE_SUB",
                        '2023-06-09 04:32:03',
                        sequelize.literal("INTERVAL " + 7 + " DAY")
                      )
                    ),
                  ],
                  status: "pending",
                },
              });

              // Get active project admins
              const product_admins = await User.findAll({
                where: {
                  userType: "admin",
                  level: 4,
                  isActive: 1,
                  isSuspended: 0,
                },
              });
              const super_admins = await User.findAll({
                where: {
                  userType: "admin",
                  level: 1,
                  isActive: 1,
                  isSuspended: 0,
                },
              });
              const admins = [...product_admins, ...super_admins];

              // Client mailer
              // await ServicePartnerMailerForProjectPayout(
              //   {
              //     email: _service_partner.email,
              //     first_name: _service_partner.fname,
              //   },
              //   amount,
              //   project
              // );
              // // Admins mailer
              // await AdminProjectPayoutMailer(
              //   { company_name: profile.company_name },
              //   admins,
              //   amount,
              //   project
              // );

              return res.status(200).send({
                success: true,
                message: "Transfer was successful!",
              });
            }
          }
        } else if (
          userLevel == 1 &&
          pendingTransaction.financialadmin == false
        ) {
          console.log("yippe");
          await TransactionPending.update(
            { superadmin: true },
            { where: { id } }
          );

          return res.status(200).send({
            success: true,
            message:
              "Approved, Transfer would be done once finance admin approves!",
          });
        }
      }
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getPendingTransfers = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const pendingTransaction = await TransactionPending.findAll({
        where: {
          financialadmin: false,
          TransactionId: { [Op.like]: `%PROD%` },
        },
      });
      if (!pendingTransaction || pendingTransaction == null) {
        return res.status(404).send({
          success: false,
          message: "Invalid Pending Transaction!",
        });
      }
      for (let i = 0; i < pendingTransaction.length; i++) {
        console.log(pendingTransaction[i]);
        // let transfer = JSON.parse(pendingTransaction[i].transfer);
        // let transaction = JSON.parse(pendingTransaction[i].transaction);
        // delete pendingTransaction[i].transfer;
        // delete pendingTransaction[i].transfer;
        // console.log(pendingTransaction[i]);
        // pendingTransaction[i].transfer = transfer;
        // pendingTransaction[i].transaction = transaction;
      }

      return res.send({
        success: true,
        message: "All Pending Product Earning Transfers!",
        data: pendingTransaction,
      });
    } catch (error) {
      next(error);
    }
  });
};
