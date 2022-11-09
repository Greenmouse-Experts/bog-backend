const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const ProductController = require("../controllers/ProductContoller");

const { validate, categoryValidation } = require("../helpers/validators");

router
  .route("/product/category")
  .post(categoryValidation(), validate, ProductController.createCategory)
  .get(ProductController.getAllCategories);

router
  .route("/product/category/:categoryId")
  .patch(ProductController.updateCategory)
  .delete(ProductController.deleteCategory)
  .get(ProductController.getCategory);

module.exports = router;
