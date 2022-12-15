/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const BlogCategory = require("../models/BlogCategory");
const BlogModel = require("../models/Blog");
const cloudinary = require("../helpers/cloudinary");
const BlogImage = require("../models/BlogImage");
const PostCategory = require("../models/PostCategory");

exports.createCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name } = req.body;
      const [category, created] = await BlogCategory.findOrCreate({
        where: { name },
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

exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.findAll();
    return res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name, categoryId } = req.body;
      const category = await BlogCategory.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await BlogCategory.update(
        { name },
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
      const { categoryId } = req.body;
      const category = await BlogCategory.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Invalid category"
        });
      }
      await BlogCategory.destroy({ where: { id: categoryId }, transaction: t });
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

// Blog Crud
exports.createBlog = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const data = req.body;
      console.log(req.body);
      const { categoryIds } = req.body;
      const photos = [];
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await cloudinary.uploader.upload(req.files[i].path);
          const docPath = result.secure_url;
          photos.push({
            image: docPath
          });
        }
      }
      if (photos.length > 0) {
        data.images = photos;
      }

      const blog = await BlogModel.create(data, {
        include: [
          {
            model: BlogImage,
            as: "images"
          }
        ],
        transaction: t
      });

      const category = categoryIds.map(cat => ({
        blogId: blog.id,
        categoryId: cat
      }));
      await PostCategory.bulkCreate(category, { transaction: t });

      return res.status(200).send({
        success: true,
        data: blog
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getMyBlogs = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }

    const blogs = await BlogModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: BlogImage,
          as: "images"
        },
        {
          model: BlogCategory,
          as: "category"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: blogs
    });
  } catch (error) {
    return next(error);
  }
};

exports.findSingleBlog = async (req, res, next) => {
  try {
    const where = {
      id: req.params.blogId
    };

    const blogs = await BlogModel.findOne({
      where,
      include: [
        {
          model: BlogImage,
          as: "images"
        },
        {
          model: BlogCategory,
          as: "category"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: blogs
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCategoryBlogs = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const where = { categoryId };
    const categories = await BlogModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: BlogImage,
          as: "images"
        },
        {
          model: BlogCategory,
          as: "category"
        }
      ]
    });
    return res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { blogId, categoryIds, ...otherInfo } = req.body;
      console.log(req.body);
      const theBlog = await BlogModel.findOne({
        where: { id: blogId }
      });
      if (!theBlog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found"
        });
      }

      await BlogModel.update(otherInfo, {
        where: { id: blogId },
        transaction: t
      });
      const photos = [];
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await cloudinary.uploader.upload(req.files[i].path);
          const docPath = result.secure_url;
          photos.push({
            image: docPath,
            blogId
          });
        }
      }
      if (photos.length > 0) {
        const images = await BlogImage.findAll({
          where: { blogId },
          attributes: ["id"]
        });
        if (images.length > 0) {
          const Ids = images.map(img => img.id);
          await BlogImage.destroy({ where: { id: Ids }, transaction: t });
        }
        await BlogImage.bulkCreate(photos, { transaction: t });
      }

      if (categoryIds && categoryIds.length > 0) {
        const categorys = await PostCategory.findAll({
          where: { blogId },
          attributes: ["id"]
        });
        if (categorys.length > 0) {
          const Ids = categorys.map(img => img.id);
          await PostCategory.destroy({ where: { id: Ids }, transaction: t });
        }
        const category = categoryIds.map(cat => ({
          blogId,
          categoryId: cat
        }));
        await PostCategory.bulkCreate(category, { transaction: t });
      }

      return res.status(200).send({
        success: true,
        message: "Blog Updated"
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.publishBlog = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { blogId, ...otherInfo } = req.body;
      const theBlog = await BlogModel.findOne({
        where: { id: blogId }
      });
      if (!theBlog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found"
        });
      }

      await BlogModel.update(otherInfo, {
        where: { id: blogId },
        transaction: t
      });

      return res.status(200).send({
        success: true,
        message: "Blog Published"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteBlog = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { blogId } = req.params;
      const theBlog = await BlogModel.findOne({
        where: { id: blogId }
      });
      if (!theBlog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found"
        });
      }
      await BlogModel.destroy({ where: { id: blogId }, transaction: t });
      return res.status(200).send({
        success: true,
        message: "Blog deleted successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
