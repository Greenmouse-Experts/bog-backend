/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Category = require("../models/ProductCategory");
const Product = require("../models/Product");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).send({
      success: true,
      data: categories
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
      return next(error);
    }
  });
};
