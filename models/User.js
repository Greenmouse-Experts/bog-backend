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
    },
    isSuspended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    kycScore: {
      type: Sequelize.INTEGER,
      defaultValue: false
    },
    kycTotal: {
      type: Sequelize.INTEGER,
      defaultValue: false
    },
    kycVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    kycDisapprovalReason: {
      type: Sequelize.TEXT,
      defaultValue: false
    },
    app: {
      type: Sequelize.STRING,
      allowNull: true
    },
    facebook_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    google_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    apple_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    login_trials: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    reason_for_suspension: {
      type: Sequelize.STRING,
      allowNull: true
    },
    last_login: {
      type: Sequelize.DATE,
      allowNull: true
    },
    years_of_experience_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    certification_of_personnel_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    no_of_staff_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    complexity_of_projects_completed_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    cost_of_projects_completed_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    quality_delivery_performance_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
    timely_delivery_peformance_rating: {
      type: Sequelize.NUMBER,
      allowNull: true
    },
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

PrivateClient.belongsTo(User, {
  foreignKey: "userId",
  as: "private_user",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(CorporateClient, {
  foreignKey: "userId",
  as: "corporate_client",
  onDelete: "cascade",
  hooks: true
});

CorporateClient.belongsTo(User, {
  foreignKey: "userId",
  as: "corporate_user",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(ServicePartner, {
  foreignKey: "userId",
  as: "service_partner",
  onDelete: "cascade",
  hooks: true
});

ServicePartner.belongsTo(User, {
  foreignKey: "userId",
  as: "service_user",
  onDelete: "cascade",
  hooks: true
});

User.hasOne(ProductPartner, {
  foreignKey: "userId",
  as: "product_partner",
  onDelete: "cascade",
  hooks: true
});

ProductPartner.belongsTo(User, {
  foreignKey: "userId",
  as: "product_user",
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
