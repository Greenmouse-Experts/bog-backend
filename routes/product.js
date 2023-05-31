/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

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

router.route("/products/delete-old").get(ProductController.deleteOldProduct);

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
    [Auth, Access.verifyAccess],
    upload.any(),
    ProductController.createProduct
  )
  .get([Auth, Access.verifyAccess], ProductController.getAllProducts);

router
  .route("/product/:productId")
  .patch([Auth, Access.verifyAccess], upload.any(), ProductController.updateProduct)
  .delete([Auth, Access.verifyAccess], ProductController.deleteProduct)
  .get(ProductController.getSingleProducts);

router
  .route("/product/add-to-shop/:productId")
  .patch([Auth, Access.verifyAccess], ProductController.addProductToShop);

// Admin routes
router
  .route("/product/admin/get-products")
  .get([Auth, Access.verifyAccess, Access.verifyAdmin], ProductController.getProductsForAdmin);

router
  .route("/product/admin/approve-product")
  .post(
    productApprovalValidation(),
    validate,
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    ProductController.approveProduct
  );
// Transfer to service partners
router.route("/products/transfer/:productId")
  .post([Auth, Access.verifyAccess, Access.verifyAdmin], ProductController.transferToServicePartner);

router
  .route("/products/pendingTransfers")
  .get([Auth, Access.verifyAccess, Access.verifyAdmin],
    ProductController.getPendingTransfers
  );

router
  .route("/products/approveTransfer/:id")
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    ProductController.approveTransferToServicePartner
  );


module.exports = router;
