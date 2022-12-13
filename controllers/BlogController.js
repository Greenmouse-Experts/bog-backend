/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const BlogCategory = require("../models/BlogCategory");
const BlogModel = require("../models/Blog");

exports.createCategory = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { name } = req.body;
      const [category, created] = await BlogCategory.findOrCreate({
        where: { name },
        transaction: t
      });
        console.log(category)
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
        {name},
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
      const blog = await BlogModel.create(
        req.body,
        {transaction: t});
      return res.status(200).send({
        success: true,
        data: blog
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getMyBlogs = async (req, res, next) => {
  try {
    const where = {};
    req.query?.id ? where.id = req.query.id : null
    req.query?.status ? where.status = req.query.status : null
    
    const blogs = await BlogModel.findAll({where});
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
    const where = { categoryId: categoryId };
    const categories = await BlogModel.findAll({where});
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
      const { blogId, ...otherInfo } = req.body;
      console.log(blogId);
      const theBlog = await BlogModel.findOne({
        where: { id: blogId }
      });
      if (!theBlog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found"
        });
      }
      console.log(otherInfo);
      await BlogModel.update(
        otherInfo,
        { where: { id: blogId }, transaction: t }
      );
      return res.status(200).send({
        success: true,
        data: theBlog
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