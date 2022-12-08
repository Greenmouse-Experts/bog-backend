const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const upload = require("../helpers/upload");
const ProductController = require("../controllers/ProductContoller");

const {
  validate,
  categoryValidation,
  productValidation,
  productApprovalValidation
} = require("../helpers/validators");

router.route("/products/all").get(ProductController.getProducts);

router
  .route("/products/similar-products")
  .get(ProductController.getSimilarProducts);

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
    upload.any(),
    ProductController.createProduct
  )
  .get(Auth, ProductController.getAllProducts);

router
  .route("/product/:productId")
  .patch(Auth, upload.any(), ProductController.updateProduct)
  .delete(Auth, ProductController.deleteProduct)
  .get(ProductController.getSingleProducts);

router
  .route("/product/add-to-shop/:productId")
  .patch(Auth, ProductController.addProductToShop);

// Admin routes
router
  .route("/product/admin/get-products")
  .get(Auth, ProductController.getProductsForAdmin);

router
  .route("/product/admin/approve-product")
  .post(
    productApprovalValidation(),
    validate,
    Auth,
    ProductController.approveProduct
  );

module.exports = router;
