const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const BlogCategory = sequelise.define(
  "blog_categories",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      allowNull: true,
      type: Sequelize.UUID
    },
  },
  { paranoid: true }
);


module.exports = BlogCategory;
