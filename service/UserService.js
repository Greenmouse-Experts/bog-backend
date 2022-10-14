const User = require("../models/User");
const Profile = require("../models/UserProfile");
const BankDetail = require("../models/BankDetail");

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
    "corporate_client"
  ];
  if (!userType.includes(type)) {
    return false;
  }
  return true;
};
