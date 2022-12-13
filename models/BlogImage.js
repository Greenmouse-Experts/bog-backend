const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Blog = require("./Blog");

const BlogImage = sequelise.define(
  "blog_images",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    blogId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    }
  },
  { paranoid: true }
);

Blog.hasMany(BlogImage, {
  foreignKey: "blogId",
  as: "images"
});

module.exports = BlogImage;
