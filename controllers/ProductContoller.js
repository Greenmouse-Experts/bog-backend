/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Category = require("../models/ProductCategory");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const User = require("../models/User");
const cloudinary = require("../helpers/cloudinary");
const Reviews = require("../models/Reviews");

exports.getProducts = async (req, res, next) => {
  try {
    const where = {
      status: "approved",
      showInShop: true
    };
    const products = await Product.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"]
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"]
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: products
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
      categoryId: req.query.category
    };
    const products = await Product.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"]
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"]
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"]
        },
        {
          model: Reviews,
          as: "product_reviews",
          attributes: ["id", "star", "reviews", "userId"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    const data = await Promise.all(
      categories.map(async category => {
        const where = {
          categoryId: category.id,
          status: "approved"
        };
        const count = await Product.count({ where });
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          totalProducts: count
        };
      })
    );
    return res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.categoryId }
    });
    return res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    return next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name, description } = req.body;
      const [category, created] = await Category.findOrCreate({
        where: { name, description },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data: category
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name, description } = req.body;
      const { categoryId } = req.params;
      const category = await Category.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await Category.update(
        {
          name,
          description
        },
        { where: { id: categoryId }, transaction: t }
      );
      return res.status(200).send({
        success: true,
        data: category
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await Category.destroy({ where: { id: categoryId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Category deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.createProduct = async (req, res, next) => {
  sequelize.transaction(async t => {
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
        status: req.body.status
      };

      const photos = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path);
        const docPath = result.secure_url;
        photos.push({
          name: req.files[i].originalname,
          image: req.files[i].path,
          creatorId,
          url: docPath
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
            as: "product_image"
          }
        ]
      });

      return res.status(200).send({
        success: true,
        message: "Product created successfully",
        data: product
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateProduct = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { productId } = req.params;
      const request = req.body;
      const creatorId = req.user.id;
      const product = await Product.findByPk(productId, {
        attributes: ["id"]
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product"
        });
      }

      if (req.files.length > 0) {
        const photos = [];
        for (let i = 0; i < req.files.length; i++) {
          const result = await cloudinary.uploader.upload(req.files[i].path);
          const docPath = result.secure_url;
          photos.push({
            name: req.files[i].originalname,
            image: req.files[i].path,
            creatorId,
            productId,
            url: docPath
          });
        }
        const images = await ProductImage.findAll({
          where: { productId },
          attributes: ["id"]
        });
        if (images.length > 0) {
          const Ids = images.map(img => img.id);
          await ProductImage.destroy({ where: { id: Ids }, transaction: t });
        }
        await ProductImage.bulkCreate(photos, { transaction: t });
        request.image = photos[0].image;
      }

      await Product.update(request, {
        where: { id: productId }
        // transaction: t
      });

      const result = await Product.findOne({
        where: { id: productId },
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email", "phone", "photo"]
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "description"]
          },
          {
            model: ProductImage,
            as: "product_image",
            attributes: ["id", "name", "image", "url"]
          }
        ]
      });

      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        data: result
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const creatorId = req.user.id;
    const where = {
      creatorId
    };
    if (req.query.status) {
      where.status = req.query.status;
    }
    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"]
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSingleProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email", "phone", "photo"]
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"]
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"]
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { productId } = req.params;
      const creatorId = req.user.id;

      const product = await Product.findOne({
        where: { id: productId }
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product"
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
        message: "Product deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.addProductToShop = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { productId } = req.params;

      const product = await Product.findOne({
        where: { id: productId }
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product"
        });
      }
      if (product.status === "disapproved") {
        return res.status(400).send({
          success: false,
          message:
            "This Product has been disapproved by admin. Please update or create a new one"
        });
      }
      await Product.update(
        { status: "in_review" },
        { where: { id: productId }, transaction: t }
      );

      return res.status(200).send({
        success: true,
        message: "Product sent for review. Please wait for admin approval"
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
        { status: "disapproved" }
      ]
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
          attributes: ["id", "name", "email", "phone", "photo"]
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description"]
        },
        {
          model: ProductImage,
          as: "product_image",
          attributes: ["id", "name", "image", "url"]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    return next(error);
  }
};

exports.approveProduct = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { productId, status } = req.body;

      const product = await Product.findOne({
        where: { id: productId }
      });
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Invalid Product"
        });
      }
      const data = {
        status
      };
      if (status === "approved") {
        data.showInShop = true;
      }
      await Product.update(data, { where: { id: productId }, transaction: t });

      return res.status(200).send({
        success: true,
        message: `Product ${status} successfully `
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
