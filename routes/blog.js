const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const BlogController = require("../controllers/BlogController");

const { validate, BlogCategoryValidation } = require("../helpers/validators");
const upload = require("../helpers/upload");

router
  .route("/blog/create-category")
  .post(
    [Auth, Access.verifyAccess],
    BlogCategoryValidation(),
    validate,
    BlogController.createCategory
  );

router.route("/blog/get-categories").get(BlogController.getBlogCategories);

router
  .route("/blog/get-category-blogs/:categoryId")
  .get(BlogController.getCategoryBlogs);

router
  .route("/blog/delete-category")
  .delete([Auth, Access.verifyAccess], BlogController.deleteCategory);

router
  .route("/blog/update-category")
  .put([Auth, Access.verifyAccess], BlogCategoryValidation(), validate, BlogController.updateCategory);

// Blog

router
  .route("/blog/create-new")
  .post([Auth, Access.verifyAccess], upload.any(), BlogController.createBlog);

router.route("/blog/get-blogs").get(BlogController.getMyBlogs);

router.route("/blog/find/:blogId").get(BlogController.findSingleBlog);

router.route("/blog/delete/:blogId").delete([Auth, Access.verifyAccess], BlogController.deleteBlog);

router
  .route("/blog/update")
  .patch([Auth, Access.verifyAccess], upload.any(), BlogController.updateBlog);

router.route("/blog/publish-post").patch([Auth, Access.verifyAccess], BlogController.publishBlog);

module.exports = router;
