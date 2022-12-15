const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const BlogCategory = require("./BlogCategory");
const PostCategory = require("./PostCategory");

const Blog = sequelise.define(
  "blogs",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING
    },
    body: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    isPublished: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isCommentable: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: Sequelize.ENUM("draft", "published", "review", "cancel"),
      allowNull: true
    }
  },
  { paranoid: true }
);

Blog.belongsToMany(BlogCategory, {
  through: PostCategory,
  foreignKey: "blogId",
  as: "category"
});

BlogCategory.belongsToMany(Blog, {
  through: PostCategory,
  foreignKey: "categoryId",
  as: "posts"
});

module.exports = Blog;
