const User = require("../models/User");

exports.findUser = async email => {
  const user = await User.findOne({ where: { email } });
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
  const user = await User.update(userData, {
    where: { id: userData.id },
    transaction
  });
  return user;
};
