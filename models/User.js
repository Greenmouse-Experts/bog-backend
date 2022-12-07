const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const BankDetail = require("./BankDetail");
const UserConnector = require("./UserConnector");
const UserProfile = require("./UserProfile");
const Referral = require("./Referral");
const PrivateClient = require("./PrivateClient");
const CorporateClient = require("./CorporateClient");
const ServicePartner = require("./ServicePartner");
const ProductPartner = require("./ProductPartner");

const User = sequelise.define(
  "users",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userType: {
      type: Sequelize.ENUM(
        "professional",
        "vendor",
        "private_client",
        "corporate_client",
        "admin"
      ),
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    street: {
      type: Sequelize.STRING,
      allowNull: true
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    referralId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    aboutUs: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { paranoid: true }
);

User.hasOne(BankDetail, {
    foreignKey: "userId",
    as: "bank_detail",
    onDelete: "cascade",
    hooks: true
});

User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(PrivateClient, {
  foreignKey: "userId",
  as: "private_client",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(CorporateClient, {
  foreignKey: "userId",
  as: "corporate_client",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(ServicePartner, {
  foreignKey: "userId",
  as: "service_partner",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(ProductPartner, {
  foreignKey: "userId",
  as: "product_partner",
  onDelete: "cascade",
  hooks: true
});

User.hasMany(UserConnector, {
  foreignKey: "userId",
  as: "connectors",
  onDelete: "cascade",
  hooks: true
});

User.hasMany(Referral, {
  foreignKey: "userId",
  as: "referrals",
  onDelete: "cascade",
  hooks: true
});

Referral.belongsTo(User, {
  foreignKey: "referredId",
  as: "referred",
  onDelete: "cascade",
  hooks: true
});

module.exports = User;
