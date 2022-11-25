require("dotenv").config();
const axios = require("axios");
const User = require("../models/User");
const Profile = require("../models/UserProfile");
const BankDetail = require("../models/BankDetail");
const Referral = require("../models/Referral");

exports.findUser = async where => {
  const user = await User.findOne({ where });
  return user;
};

exports.getUserDetails = async where => {
  const user = await User.findOne({
    where,
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"]
    },
    include: [
      {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      },
      {
        model: BankDetail,
        as: "bank_detail",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      }
    ]
  });
  return user;
};

exports.getAllUsers = async where => {
  const user = await User.findAll({
    where,
    attributes: {
      exclude: ["password", "deletedAt"]
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      },
      {
        model: BankDetail,
        as: "bank_detail",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      }
    ]
  });
  return user;
};

exports.findUserDetail = async where => {
  const user = await User.findOne({
    where,
    attributes: {
      exclude: ["password", "deletedAt"]
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      },
      {
        model: BankDetail,
        as: "bank_detail",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"]
        }
      }
    ]
  });
  return user;
};

exports.findUserById = async id => {
  const user = await User.findByPk(id);
  return user;
};

exports.createNewUser = async (userData, transaction) => {
  const user = await User.create(userData, { transaction });
  return user;
};

exports.updateUser = async (userData, transaction) => {
  await User.update(userData, {
    where: { id: userData.id },
    transaction
  });
  return true;
};

exports.createProfile = async (userData, transaction) => {
  const profile = await Profile.create(userData, { transaction });
  return profile;
};

exports.updateUserProfile = async (userData, where, transaction) => {
  await Profile.update(userData, {
    where,
    transaction
  });
  return true;
};

exports.getProfile = async where => {
  const profile = await Profile.findOne({ where });
  return profile;
};

exports.createBankDetails = async (data, transaction) => {
  const bank = await BankDetail.create(data, { transaction });
  return bank;
};

exports.updateBankDetails = async (data, transaction) => {
  await BankDetail.update(data, {
    where: { id: data.id },
    transaction
  });
  return true;
};

exports.deleteBankDetails = async (data, transaction) => {
  await BankDetail.update(data, {
    where: { id: data.id },
    transaction
  });
  return true;
};

exports.getBankDetails = async where => {
  const bank = await BankDetail.findOne({ where });
  return bank;
};

exports.validateUserType = type => {
  const userType = [
    "professional",
    "vendor",
    "private_client",
    "corporate_client",
    "admin",
    "none"
  ];
  if (!userType.includes(type)) {
    return false;
  }
  return true;
};

exports.createReferral = async (data, transaction) => {
  const reference = await Referral.create(data, { transaction });
  return reference;
};

exports.updateReferral = async (data, transaction) => {
  await Referral.update(data, {
    where: { id: data.id },
    transaction
  });
  return true;
};

exports.deleteReferral = async (data, transaction) => {
  await Referral.update(data, {
    where: { id: data.id },
    transaction
  });
  return true;
};

exports.findReferral = async where => {
  const referral = await Referral.findOne({ where });
  return referral;
};

exports.getReferrals = async where => {
  const referrals = await Referral.findAll({ where });
  return referrals;
};

exports.validateCaptcha = async captcha => {
  try {
    // req.connection.remoteAddress
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_SECRET}&response=${captcha}`;
    const response = await axios.post(url);
    if (!response.data.success || response.data.success !== true) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
