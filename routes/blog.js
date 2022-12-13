const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const BlogController = require("../controllers/BlogController");

const {
  validate,
  BlogValidation,
  BlogCategoryValidation
} = require("../helpers/validators");

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
  .get(validate, Auth, BlogController.getCategoryBlogs);

router
  .route("/blog/delete-category")
  .delete(Auth, BlogController.deleteCategory);

router
  .route("/blog/update-category")
  .put(BlogCategoryValidation(), validate, Auth, BlogController.updateCategory);

// Blog

router
  .route("/blog/create-new")
  .post(BlogValidation(), validate, Auth, BlogController.createBlog);

router.route("/blog/get-blogs").get(Auth, BlogController.getMyBlogs);

router.route("/blog/delete/:blogId").delete(Auth, BlogController.deleteBlog);

router.route("/blog/update").post(Auth, BlogController.updateBlog);

module.exports = router;
