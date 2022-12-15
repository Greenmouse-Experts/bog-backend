const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const BlogController = require("../controllers/BlogController");

const {
  validate,
  BlogValidation,
  BlogCategoryValidation
} = require("../helpers/validators");
const upload = require("../helpers/upload");

router
  .route("/blog/create-category")
  .post(
    BlogCategoryValidation(),
    validate,
    Auth,
    BlogController.createCategory
  );

router
  .route("/blog/get-categories")
  .get(Auth, BlogController.getBlogCategories);

router
  .route("/blog/get-category-blogs/:categoryId")
  .get(Auth, BlogController.getCategoryBlogs);

router
  .route("/blog/delete-category")
  .delete(Auth, BlogController.deleteCategory);

router
  .route("/blog/update-category")
  .put(BlogCategoryValidation(), validate, Auth, BlogController.updateCategory);

// Blog

router
  .route("/blog/create-new")
  .post(upload.any(), Auth, BlogController.createBlog);

router.route("/blog/get-blogs").get(Auth, BlogController.getMyBlogs);

router.route("/blog/find/:blogId").get(BlogController.findSingleBlog);

router.route("/blog/delete/:blogId").delete(Auth, BlogController.deleteBlog);

router
  .route("/blog/update")
  .patch(Auth, upload.any(), BlogController.updateBlog);

router.route("/blog/publish-post").patch(Auth, BlogController.publishBlog);

module.exports = router;
