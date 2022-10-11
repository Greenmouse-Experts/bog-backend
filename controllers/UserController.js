const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database/connection");

exports.registerUser = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      return res.status(201).send({
        success: true,
        message: "User Created Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.loginUser = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      return res.status(201).send({
        success: true,
        message: "User Logged In Sucessfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
