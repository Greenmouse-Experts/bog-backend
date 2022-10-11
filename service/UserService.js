const User = require("../models/User");

exports.findUser = async email => {
  const user = await User.findOne({ where: { email } });
  return user;
};

exports.findUserById = async id => {
  const user = await User.findOne({
    where: { id },
    attributes: ["id", "name", "email"]
  });
  return user;
};

exports.createNewUser = async (userData, transaction) => {
  const user = await User.create(userData, { transaction });
  return user;
};
