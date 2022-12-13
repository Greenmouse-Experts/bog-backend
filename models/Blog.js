const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const Blog = sequelise.define(
  "blogs",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    categoryId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM(
            "draft", "published", "review", "cancel"
        ),
        allowNull: true
    }
  },
  { paranoid: true }
);

module.exports = Blog;
