const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const Product = require("./Product");
const Partner = require("./ServicePartner");

const PartnerReview = sequelise.define(
  "service_reviews",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    productId: {
      allowNull: true,
      type: Sequelize.UUID
    },
    star: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    review: {
        allowNull: true,
        type: Sequelize.STRING,
    }
  },
  { paranoid: true }
);

Partner.hasMany(PartnerReview, {
    foreignKey: "id",
    as: "partner_reviews",
    onDelete: "cascade",
    hooks: true
});


module.exports = PartnerReview;
