const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const upload = require("../helpers/upload");
const ProductController = require("../controllers/ProductContoller");

const {
  validate,
  categoryValidation,
  productValidation
} = require("../helpers/validators");

router
  .route("/product/category")
  .post(categoryValidation(), validate, ProductController.createCategory)
  .get(ProductController.getAllCategories);

router
  .route("/product/category/:categoryId")
  .patch(ProductController.updateCategory)
  .delete(ProductController.deleteCategory)
  .get(ProductController.getCategory);

router
  .route("/products")
  .post(
    // productValidation(),
    // validate,
    Auth,
    upload.array("photos", 5),
    ProductController.createProduct
  )
  .get(Auth, ProductController.getAllProducts);

router
  .route("/product/:productId")
  .patch(Auth, upload.array("photos", 5), ProductController.updateProduct)
  .delete(Auth, ProductController.deleteProduct)
  .get(ProductController.getSingleProducts);

module.exports = router;
