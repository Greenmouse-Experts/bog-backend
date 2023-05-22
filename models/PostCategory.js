const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const PostCategory = sequelise.define(
  "post_categories",
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
    categoryId: {
      allowNull: true,
      type: Sequelize.UUID
    }
  },
  { paranoid: true }
);

module.exports = PostCategory;
