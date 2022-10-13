/* eslint-disable no-unused-vars */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const randomstring = require("randomstring");
const sequelize = require("../config/database/connection");
const UserService = require("../service/UserService");
const helpers = require("../helpers/message");
const EmailService = require("../service/emailService");

exports.registerUser = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { email, userType } = req.body;
      const user = await UserService.findUser({ email });

      if (user) {
        return res.status(400).send({
          success: false,
          message: "This Email is already in Use"
        });
      }

      const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, 10),
        userType: req.body.userType,
        address: req.body.address
      };

      const newUser = await UserService.createNewUser(userData, t);
      if (userType !== "private_client") {
        const data = {
          userId: newUser.id,
          company_name: req.body.company_name
        };
        await UserService.createProfile(data, t);
      }
      t.commit();
      const token = randomstring.generate(24);
      const message = helpers.verifyEmailMessage(email, token);
      await EmailService.sendMail(email, message, "Verify Email");
      const data = {
        token,
        id: newUser.id
      };
      await UserService.updateUser(data, t);

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
      const { email, password } = req.body;
      const user = await UserService.findUser({ email });

      if (!user) {
        return res.status(400).send({
          success: false,
          message: "Invalid User"
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).send({
          success: false,
          message: "Invalid User Details"
        });
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 360000
      });
      return res.status(201).send({
        success: true,
        message: "User Logged In Sucessfully",
        token
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No User Found",
        user: null
      });
    }
    return res.status(200).send({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};

exports.verifyUser = async (req, res, next) => {
  sequelize.transaction(async transaction => {
    try {
      const { email, token } = req.params;
      const user = await UserService.findUser({ email, token });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "No User found with this email"
        });
      }

      const data = {
        id: user.id,
        isActive: true,
        token: null
      };
      await UserService.updateUser(data, transaction);
      return res.status(200).send({
        success: true,
        message: "Account Activated Successfully"
      });
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  });
};

exports.updateUserAccount = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const data = req.body;
      const userId = req.user.id;
      const user = await UserService.findUserById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Invalid user"
        });
      }
      await UserService.updateUser(data, t);
      return res.status(201).send({
        success: true,
        message: "Profile Updated Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateUserProfile = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const data = req.body;
      const userId = req.user.id;
      const user = await UserService.findUserById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Invalid user"
        });
      }
      // "professional",
      //   "vendor",
      //   "private_client",
      //   "corporate_client"
      let requestData;
      const { bankData } = req.body;
      if (user.userType === "professional") {
        requestData = {
          userId,
          company_name: data.company_name,
          company_address: data.company_address,
          certificate_of_operation: data.operation,
          professional_certificate: data.certificate,
          years_of_experience: data.years
        };
        await UserService.updateUserProfile(requestData, t);
      } else if (
        user.userType === "vendor" ||
        user.userType === "corporate_client"
      ) {
        requestData = {
          userId,
          company_name: data.company_name,
          company_address: data.company_address,
          tin: data.tin,
          cac_number: data.cac_number,
          years_of_experience: data.years
        };
        await UserService.updateUserProfile(requestData, t);
      }
      bankData.userId = userId;
      const bank = await UserService.getBankDetails({ userId });
      if (bank) {
        await UserService.updateBankDetails(bankData, t);
      } else {
        await UserService.createBankDetails(bankData, t);
      }

      return res.status(201).send({
        success: true,
        message: "Profile Updated Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.changePassword = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { id } = req.user;
      const { oldPassword, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(500).send({
          success: false,
          message: "Passwords do not match"
        });
      }

      const user = await UserService.findUserById(id);

      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(500).send({
          success: false,
          message: "Incorrect Old Password"
        });
      }
      const currentPassword = bcrypt.hashSync(password, 10);
      const data = {
        password: currentPassword,
        id
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        success: true,
        message: "Password Changed Successfully",
        user
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.forgotPassword = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { email } = req.body;

      const user = await UserService.findUser({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Invalid user"
        });
      }

      const token = randomstring.generate(24);
      const message = helpers.resetPasswordMessage(email, token);
      await EmailService.sendMail(email, message, "Reset Password");
      const data = {
        token,
        id: user.id
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        success: true,
        message: "Password Reset Email Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.resetPassword = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { email, token, password } = req.body;

      const user = await UserService.findUser({ token, email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Invalid user"
        });
      }

      const currentPassword = bcrypt.hashSync(password, 10);
      const data = {
        password: currentPassword,
        id: user.id
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        status: true,
        message: "Password Changed Successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
