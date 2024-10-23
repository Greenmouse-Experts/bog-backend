/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passport = require('passport-facebook');
const FacebookStrategy = require('passport-facebook-token');
// const store = require('store2')
// const createClient = require('redis');

const randomstring = require('randomstring');
const { Op } = require('sequelize');
const sequelize = require('../config/database/connection');
const UserService = require('../service/UserService');
const helpers = require('../helpers/message');
const EmailService = require('../service/emailService');
const ServicePartner = require('../models/ServicePartner');
const ProductPartner = require('../models/ProductPartner');
const Projects = require('../models/Project');
const PrivateClient = require('../models/PrivateClient');
const CorporateClient = require('../models/CorporateClient');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Notification = require('../helpers/notification');

// const cloudinary = require('../helpers/cloudinaryMediaProvider');
const cloudinary = require('cloudinary').v2;

const {
  adminLevels,
  adminPrivileges,
  USERTYPE,
  USERROLES,
  generateReferralCode,
} = require('../helpers/utility');
const ServiceProvider = require('../models/ServiceProvider');

const {
  ClientForgotPasswordMobileMailer,
  ClientForgotPasswordMailer,
  AdminSuspendUserMailerForUser,
  AdminSuspendUserMailerForAdmin,
  clientWelcomeMessage,
  servicePartnerWelcomeMessage,
  productPartnerWelcomeMessage,
  AccountProfileCreationMailer,
} = require('../helpers/mailer/samples');

const axios = require('axios');
const SupportSocial = require('../models/supportsocial');
const AdminMessage = require('../models/AdminMessage');
const UserProfile = require('../models/UserProfile');

// const Client = require("../helpers/storage")

// createClient({
//   url: process.env.REDIS_URL
// });

// const client = createClient();

// client.on('error', err => console.log('Redis Client Error', err));

exports.findName = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user_found = await User.findOne({ where: { name } });
    if (user_found) {
      return res.status(400).send({
        success: false,
        message: 'Name exists.',
      });
    }

    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.findPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user_found = await User.findOne({ where: { phone } });
    if (user_found) {
      return res.status(400).send({
        success: false,
        message: 'Phone number exists.',
      });
    }

    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        email,
        phone,
        userType,
        name,
        captcha,
        company_name,
        referrerCode,
      } = req.body;

      if (!req.body.platform && userType !== 'admin') {
        const validateCaptcha = await UserService.validateCaptcha(captcha);
        if (!validateCaptcha) {
          return res.status(400).send({
            success: false,
            message: 'Please answer the captcha correctly',
            validateCaptcha,
          });
        }
      }

      const isUserType = UserService.validateUserType(userType);
      if (!isUserType) {
        return res.status(400).send({
          success: false,
          message: 'Invalid User Entity passed',
        });
      }

      let user = await UserService.findUser({ email });

      if (user) {
        // if (user.userType ===  ) {
        //   return res.status(400).send({
        //     success: false,
        //     message: 'Account not found.',
        //   });
        // }

        if (company_name) {
          const profileFound = await UserService.getProfile({
            company_name,
          });

          if (profileFound) {
            if (profileFound.userId !== user.id) {
              return res.status(400).send({
                success: false,
                message: 'Company name exists',
              });
            }
          }
        }
      } else {
        if (company_name) {
          const profileFound = await UserService.getProfile({
            company_name,
          });

          if (profileFound) {
            return res.status(400).send({
              success: false,
              message: 'Company name exists',
            });
          }
        }
      }

      let user_found = await User.findOne({
        where: { phone },
      });
      if (user_found) {
        if (user_found.email !== email) {
          return res.status(400).send({
            success: false,
            message: 'Phone number exists.',
          });
        }
      }

      let user_exists = user;

      if (!user) {
        const userData = {
          name: req.body.name,
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          phone: req.body.phone,
          password: bcrypt.hashSync(req.body.password, 10),
          userType: req.body.userType,
          address: req.body.address,
          level: req.body.level,
          referralId: randomstring.generate(12),
          aboutUs: req.body.aboutUs,
          referrerCode: req.body.referrerCode,
        };

        USERROLES.forEach((role) => {
          if (role === req.body.userType) {
            userData[`${role}_account_creation_date`] = new Date();
          }
        });

        user = await UserService.createNewUser(userData, t);
        let token = helpers.generateWebToken();
        const encodeEmail = encodeURIComponent(email);
        let message = helpers.verifyEmailMessage(name, encodeEmail, token);
        if (req.body.platform === 'mobile') {
          token = helpers.generateMobileToken();
          message = helpers.mobileVerifyMessage(name, token);
        }
        if (userType !== 'admin') {
          await EmailService.sendMail(email, message, 'Verify Email');
        }
        const data = {
          token,
          id: user.id,
        };
        await UserService.updateUser(data, t);
        // check if refferalId was passed
        if (req.body.reference && req.body.reference !== '') {
          const where = {
            referralId: {
              [Op.eq]: req.body.reference,
            },
          };
          const reference = await UserService.findUser(where);
          if (reference) {
            const referenceData = {
              userId: reference.id,
              referredId: user.id,
            };
            await UserService.createReferral(referenceData, t);
          }
        }
        if (userType !== 'admin' || userType !== 'other') {
          const request = {
            userId: user.id,
            userType,
            company_name: req.body.company_name,
            serviceTypeId: req.body.serviceTypeId,
          };
          const result = await this.addUserProfile(request, t);
        }
      } else {
        const isUser = await this.checkIfAccountExist(userType, user.id);
        if (isUser) {
          return res.status(400).send({
            success: false,
            message: 'Email address already exists',
          });
        }

        if (userType !== 'admin' || userType !== 'other') {
          const request = {
            userId: user.id,
            userType,
            company_name: req.body.company_name,
            serviceTypeId: req.body.serviceTypeId,
          };
          const result = await this.addUserProfile(request, t);
        }

        let userData = {};
        USERROLES.forEach((role) => {
          if (role === req.body.userType) {
            userData[`${role}_account_creation_date`] = new Date();
          }
        });
        (userData.id = user.id), await UserService.updateUser(userData, t);
      }

      const type = ['professional', 'vendor', 'corporate_client'];
      if (type.includes(userType)) {
        const data = {
          userId: user.id,
          company_name: req.body.company_name,
        };
        await UserService.createProfile(data, t);
      }

      const mesg = `A new user just signed up as ${UserService.getUserType(
        userType
      )}`;
      const userId = user.id;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        userId,
        type: notifyType,
        message: mesg,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      return res.status(201).send({
        success: true,
        message: 'User created successfully',
        exists: user_exists ? true : false,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.testfblogin = async (req, res) => {
  passport.authenticate('facebook');
};

/**
 *
 * @method POST
 * @param {string} facebook_first_name
 * @param {string} facebook_last_name
 * @param {string} facebook_email
 * @param {string} facebook_id
 * @param {string} user_type
 * @param {string} company_name
 * @return {json} response
 */
exports.facebookSignup = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    let first_name = req.body.facebook_first_name;
    let last_name = req.body.facebook_last_name;
    let name = `${first_name} ${last_name}`;
    let email = req.body.facebook_email;
    let facebook_id = req.body.facebook_id;
    let user_type = req.body.user_type;
    let company_name = req.body.company_name;

    try {
      const user = await User.findOne({ where: { email } });
      if (user !== null) {
        return res.status(404).json({
          success: false,
          message: 'Account exists!',
        });
      }

      const user_ = await User.create({
        name,
        fname: first_name,
        lname: last_name,
        email,
        userType: user_type,
        level: 1,
        facebook_id,
        isActive: true,
        app: 'facebook',
      });

      if (user_type !== 'admin' || user_type !== 'other') {
        const request = {
          userId: user_.id,
          userType: user_type,
          company_name,
        };
        const result = await this.addUserProfile(request, t);
      }

      const type = ['corporate_client'];
      if (type.includes(user_type)) {
        const data = {
          userId: user_.id,
          company_name,
        };
        await UserService.createProfile(data, t);
      }

      const mesg = `A new user just signed up as ${UserService.getUserType(
        user_type
      )}`;
      const userId = user_.id;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        userId,
        type: notifyType,
        message: mesg,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      return res.status(201).send({
        success: true,
        message: 'User Created Successfully',
      });
    } catch (err) {
      console.error(err);
      t.rollback();
      return next(err);
    }
  });
};

/**
 * Apple login/signup for clients only
 * @method POST
 * @param {string} access_token
 * @param {string} google_first_name
 * @param {string} google_last_name
 * @param {string} google_email
 * @param {string} google_id
 * @param {string} user_type
 * @param {string} company_name
 * @return {json} response
 */
exports.appleSign = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    const { user_type, company_name } = req.body;
    const { id, email, name } = req.apple_details;

    try {
      const user = await User.findOne({ where: { email } });

      /**
       * If user is found, login, else signup
       */
      if (user !== null) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 36000,
        });
        let profile;
        const data = {
          ...user.toJSON(),
        };
        const userId = user.id;
        profile = await UserService.getUserTypeProfile(user_type, userId);
        if (profile) {
          data.profile = profile;
          data.userType = user_type;
        }

        return res.status(200).send({
          success: true,
          message: 'User Logged In Sucessfully',
          token,
          user: data,
        });
      }

      const user_ = await User.create({
        name,
        fname: name.split(' ')[0],
        lname: name.split(' ')[1],
        email,
        userType: user_type,
        level: 1,
        apple_id: id,
        isActive: true,
        app: 'apple',
      });

      if (user_type !== 'admin' || user_type !== 'other') {
        const request = {
          userId: user_.id,
          userType: user_type,
          company_name: company_name !== undefined ? company_name : null,
        };
        const result = await this.addUserProfile(request, t);
      }

      const type = ['corporate_client'];
      if (type.includes(user_type)) {
        const data = {
          userId: user_.id,
          company_name: company_name !== undefined ? company_name : null,
        };
        await UserService.createProfile(data, t);
      }

      const mesg = `A new user just signed up as ${UserService.getUserType(
        user_type
      )} through ${'apple'}`;
      const userId = user_.id;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        userId,
        type: notifyType,
        message: mesg,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      return res.status(201).send({
        success: true,
        message: 'User Created Successfully',
      });
    } catch (err) {
      console.error(err);
      t.rollback();
      return next(err);
    }
  });
};

/**
 * Google login/signup for clients only
 * @method POST
 * @param {string} access_token
 * @param {string} google_first_name
 * @param {string} google_last_name
 * @param {string} google_email
 * @param {string} google_id
 * @param {string} user_type
 * @param {string} company_name
 * @return {json} response
 */
exports.googleSign = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    const { user_type, company_name } = req.body;
    const { id, email, verified_email, name } = req.google_details;

    try {
      const user = await User.findOne({ where: { email } });

      /**
       * If user is found, login, else signup
       */
      if (user !== null) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 36000,
        });
        let profile;
        const data = {
          ...user.toJSON(),
        };
        const userId = user.id;
        profile = await UserService.getUserTypeProfile(user_type, userId);
        if (profile) {
          data.profile = profile;
          data.userType = user_type;
        }

        return res.status(200).send({
          success: true,
          message: 'User Logged In Sucessfully',
          token,
          user: data,
        });
      }

      const user_ = await User.create({
        name,
        fname: name.split(' ')[0],
        lname: name.split(' ')[1],
        email,
        userType: user_type,
        level: 1,
        google_id: id,
        isActive: true,
        app: 'google',
      });

      if (user_type !== 'admin' || user_type !== 'other') {
        const request = {
          userId: user_.id,
          userType: user_type,
          company_name: company_name !== undefined ? company_name : null,
        };
        const result = await this.addUserProfile(request, t);
      }

      const type = ['corporate_client'];
      if (type.includes(user_type)) {
        const data = {
          userId: user_.id,
          company_name: company_name !== undefined ? company_name : null,
        };
        await UserService.createProfile(data, t);
      }

      const mesg = `A new user just signed up as ${UserService.getUserType(
        user_type
      )} through ${'google'}`;
      const userId = user_.id;
      const notifyType = 'admin';
      const { io } = req.app;
      await Notification.createNotification({
        userId,
        type: notifyType,
        message: mesg,
      });
      io.emit('getNotifications', await Notification.fetchAdminNotification());

      const payload = {
        user: {
          id: user_.id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 36000,
      });

      let profile;
      const _data = {
        ...user_.toJSON(),
      };
      const _userId = user_.id;
      profile = await UserService.getUserTypeProfile(user_type, _userId);
      if (profile) {
        _data.profile = profile;
        _data.userType = user_type;
      }
      return res.status(201).send({
        success: true,
        message: 'User Created Successfully',
        user: _data,
        token,
      });
    } catch (err) {
      console.error(err);
      t.rollback();
      return next(err);
    }
  });
};

/**
 * Sign in using facebook account
 * @method  POST
 * @param   {string} facebook_id
 * @return    {json} response
 */
exports.facebookSignin = async (req, res) => {
  let facebook_id = req.body.facebook_id;

  try {
    const user = await User.findOne({
      where: {
        facebook_id,
      },
    });

    if (user === null) {
      return res.status(404).json({
        success: false,
        message: 'Facebook account not found!',
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 36000,
    });
    let profile;
    const data = {
      ...user.toJSON(),
    };
    const userId = user.id;
    if (req.body.userType && req.body.userType !== '') {
      const { userType } = req.body;
      profile = await UserService.getUserTypeProfile(userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = userType;
      }
    } else {
      profile = await UserService.getUserTypeProfile(user.userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = user.userType;
      }
    }

    return res.status(200).send({
      success: true,
      message: 'User Logged In Sucessfully',
      token,
      user: data,
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Sign in using google account
 * @method  POST
 * @param   {string} facebook_id
 * @return    {json} response
 */
exports.googleSignin = async (req, res) => {
  let google_id = req.body.google_id;

  try {
    const user = await User.findOne({
      where: {
        google_id,
      },
    });

    if (user === null) {
      return res.status(404).json({
        success: false,
        message: 'Google account not found!',
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 36000,
    });
    let profile;
    const data = {
      ...user,
    };
    const userId = user.id;
    if (req.body.userType && req.body.userType !== '') {
      const { userType } = req.body;
      profile = await UserService.getUserTypeProfile(userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = userType;
      }
    } else {
      profile = await UserService.getUserTypeProfile(user.userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = user.userType;
      }
    }

    return res.status(200).send({
      success: true,
      message: 'User Logged In Sucessfully',
      token,
      user: data,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.registerAdmin = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      let { email, userType, name, password } = req.body;

      // Generate password if not passed
      if (!password) {
        password = randomstring.generate(12);
      }

      const isUserType = UserService.validateUserType(userType);
      if (!isUserType) {
        return res.status(400).send({
          success: false,
          message: 'Invalid user entity passed',
        });
      }

      const user = await UserService.findUser({ email });
      if (user) {
        return res.status(400).send({
          success: false,
          message: 'Email address already exists.',
        });
      }

      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(password, 10),
        userType: req.body.userType,
        level: req.body.level,
      };

      const admin = await UserService.createNewUser(userData, t);

      let token = helpers.generateWebToken();
      const encodeEmail = encodeURIComponent(email);

      const data = {
        token,
        id: admin.id,
      };
      await UserService.updateUser(data, t);

      let message = helpers.verifyEmailMessageForAdmin(
        name,
        encodeEmail,
        token,
        password
      );

      console.log(123456);
      await EmailService.sendMail(email, message, 'Verify Email');

      return res.status(201).send({
        success: true,
        message: 'Account created Successfully',
        admin,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.loginUser = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { email, password } = req.body;
      const user = JSON.parse(
        JSON.stringify(await UserService.findUser({ email }))
      );

      if (!user) {
        return res.status(400).send({
          success: false,
          message: 'Invalid Email Address!',
        });
      }
      if (user.userType === 'admin') {
        return res.status(400).send({
          success: false,
          message: 'This account is not available',
        });
      }
      if (!user.isActive) {
        return res.status(400).send({
          success: false,
          message: 'Please Verify account',
        });
      }
      if (user.isSuspended) {
        return res.status(400).send({
          success: false,
          message:
            'Your account has been suspended. Reach out to the admin for further information',
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).send({
          success: false,
          message: 'Incorrect Password!',
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRATION,
      });
      const refresh_token = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
        expiresIn: process.env.JWT_SECRET_REFRESH_EXPIRATION,
      });

      let profile;
      const data = {
        ...user,
      };
      const userId = user.id;
      if (req.body.userType && req.body.userType !== '') {
        const { userType } = req.body;
        profile = await UserService.getUserTypeProfile(userType, userId);
        if (profile) {
          data.profile = profile;
          data.userType = userType;
        }
      } else {
        profile = await UserService.getUserTypeProfile(user.userType, userId);
        if (profile) {
          data.profile = profile;
          data.userType = user.userType;
        }
      }

      let details_ = {};

      if (user.last_login === null) {
        if (user.userType.includes('client')) {
          // for corporate and private clients
          await clientWelcomeMessage(user);
        } else if (user.userType === 'professional') {
          // for service partners
          await servicePartnerWelcomeMessage(user);
        } else if (user.userType === 'vendor') {
          // for product partners
          await productPartnerWelcomeMessage(user);
        }

        details_.last_login = new Date();
      }

      // Create referral code if non existent
      if (!user.referralCode) {
        details_.referralCode = generateReferralCode(8);
      }

      await User.update(details_, { where: { id: user.id } });

      // Record referral
      await createReferral(user.referrerCode, user.id);

      // Email to notify user on the created account profile
      await AccountProfileCreationMailer({
        name: user.name,
        fname: user.fname,
        userType: UserService.getUserType(user.userType),
        email: user.email,
      });

      return res.status(201).send({
        success: true,
        message: 'User Logged In Sucessfully',
        token,
        refresh_token,
        user: Object.assign({}, data, details_),
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

/**
 * Create referral
 * @param {*} referrerId
 * @param {*} refereeId
 */
async function createReferral(referrerCode, refereeId) {
  try {
    // Fetch referrer by id
    const referrer = await User.findOne({ where: { referrerCode } });

    if (referrer) {
      // Check referral details
      const referralDetails = await Referral.findOne({
        where: { userId: referrer.id, referredId: refereeId },
      });

      if (!referralDetails) {
        await Referral.create({
          userId: referrer.id,
          referredId: refereeId,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const payload = {
      user: req.user,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
    });
    const refresh_token = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: process.env.JWT_SECRET_REFRESH_EXPIRATION,
    });

    return res.status(200).send({
      success: true,
      token,
      refresh_token,
    });
  } catch (error) {
    t.rollback();
    return next(error);
  }
};

const avg_rating = (details) => {
  const {
    years_of_experience_rating,
    certification_of_personnel_rating,
    no_of_staff_rating,
    complexity_of_projects_completed_rating,
    cost_of_projects_completed_rating,
    quality_delivery_performance_rating,
    timely_delivery_peformance_rating,
  } = details;

  const total = Object.keys(details).length;
  let rating = 0;
  if (years_of_experience_rating) {
    rating += years_of_experience_rating || 0;
  }
  if (certification_of_personnel_rating) {
    rating += certification_of_personnel_rating || 0;
  }
  if (no_of_staff_rating) {
    rating += no_of_staff_rating || 0;
  }
  if (complexity_of_projects_completed_rating) {
    rating += complexity_of_projects_completed_rating || 0;
  }
  if (cost_of_projects_completed_rating) {
    rating += cost_of_projects_completed_rating || 0;
  }
  if (quality_delivery_performance_rating) {
    rating += quality_delivery_performance_rating || 0;
  }
  if (timely_delivery_peformance_rating) {
    rating += timely_delivery_peformance_rating || 0;
  }

  // console.log(rating);
  // console.log(Object.keys(details).length);
  // console.log(Object.keys(details));

  return (rating / total).toFixed(1);
};

exports.switchAccount = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userType } = req.body;
      const userId = req.user.id;
      const where = { id: userId };
      const user = JSON.parse(
        JSON.stringify(await UserService.getUserDetails(where))
      );
      if (!user) {
        return res.status(400).send({
          success: false,
          message: 'Invalid User',
        });
      }
      if (user.userType === 'admin') {
        return res.status(400).send({
          success: false,
          message: 'This user is not available',
        });
      }
      let profile;
      const attributes = {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      };
      if (userType === 'professional') {
        profile = JSON.parse(
          JSON.stringify(
            await ServicePartner.findOne({ where: { userId }, attributes })
          )
        );
      } else if (userType === 'vendor') {
        profile = JSON.parse(
          JSON.stringify(
            await ProductPartner.findOne({ where: { userId }, attributes })
          )
        );
      } else if (userType === 'private_client') {
        profile = JSON.parse(
          JSON.stringify(
            await PrivateClient.findOne({ where: { userId }, attributes })
          )
        );
      } else if (userType === 'corporate_client') {
        profile = JSON.parse(
          JSON.stringify(
            await CorporateClient.findOne({ where: { userId }, attributes })
          )
        );
      }
      user.profile = profile;

      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 36000,
      });
      return res.status(201).send({
        success: true,
        message: 'User Logged In Sucessfully',
        token,
        user,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAccounts = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const accounts = await this.getAccountsData(userId);

      return res.status(201).send({
        success: true,
        accounts,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteAccount = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;

      // Delete user
      await User.destroy({ where: { id: userId } });

      return res.status(200).send({
        success: true,
        message: 'User account deleted successfully!',
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.contactAdmin = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        first_name,
        last_name,
        phone,
        email,
        message,
        captcha,
      } = req.body;

      if (!req.body.platform) {
        const validateCaptcha = await UserService.validateCaptcha(captcha);
        if (!validateCaptcha) {
          return res.status(400).send({
            success: false,
            message: 'Please answer the captcha correctly',
            validateCaptcha,
          });
        }
      }

      const html_data = `
        Name: ${first_name} ${last_name}<br/>
        Phone Number: ${phone}<br/>
        Email: ${email}<br/><br/>
        Message: <br/>
        ${message}
      `;
      await EmailService.sendMail(
        process.env.EMAIL_FROM,
        html_data,
        'Contact Us'
      );

      return res.status(200).send({
        success: true,
        message: 'Message sent successfully!',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAccountsData = async (userId) => {
  try {
    const attributes = ['id', 'userId', 'userType'];
    const accounts = {
      service_partner: await ServicePartner.findOne({
        where: { userId },
        attributes,
      }),
      product_partner: await ProductPartner.findOne({
        where: { userId },
        attributes,
      }),
      private_client: await PrivateClient.findOne({
        where: { userId },
        attributes,
      }),
      corporate_client: await CorporateClient.findOne({
        where: { userId },
        attributes,
      }),
    };
    const data = [];
    for (const key in accounts) {
      if (accounts[key] === null || accounts[key] === undefined) {
        delete accounts[key];
      }
      data.push(accounts[key]);
    }
    const filtered = data.filter((where) => where != null);

    return filtered;
  } catch (error) {
    return error;
  }
};

/**
 * verification before login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.verifyLogin = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { email, password } = req.body;
      if (typeof email !== 'undefined') {
        const user = await UserService.findUser({ email });

        if (!user) {
          return res.status(400).send({
            success: false,
            message: 'Invalid Email Address!',
          });
        }

        if (typeof password !== 'undefined') {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(404).send({
              success: false,
              message: 'Incorrect Password!',
            });
          }
        }
      }
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.loginAdmin = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { email, password } = req.body;
      const user = await UserService.findUser({ email });

      if (!user) {
        return res.status(400).send({
          success: false,
          message: 'Invalid Email Address!',
        });
      }
      if (user.userType !== 'admin') {
        return res.status(400).send({
          success: false,
          message: 'This Account is not known',
        });
      }
      if (user.isSuspended) {
        return res.status(400).send({
          success: false,
          message: 'Your access has been revoked by the superadmin',
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).send({
          success: false,
          message: 'Invalid Password!',
        });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRATION_ADMIN,
      });
      const refresh_token = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
        expiresIn: process.env.JWT_SECRET_REFRESH_EXPIRATION,
      });

      const _adminLevel = adminLevels.find(
        (_level) =>
          _level.level === user.level && _level.type.includes(user.userType)
      );

      const _adminPrivilege = adminPrivileges.find(
        (_privilege) => _privilege.type === _adminLevel.type
      );

      return res.status(201).send({
        success: true,
        message: 'Admin Logged In Sucessfully',
        token,
        refresh_token,
        user: { ...user.toJSON(), role: _adminPrivilege },
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = JSON.parse(
      JSON.stringify(await UserService.findUserById(req.user.id))
    );
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
        user: null,
      });
    }

    const {
      years_of_experience_rating,
      certification_of_personnel_rating,
      no_of_staff_rating,
      complexity_of_projects_completed_rating,
      cost_of_projects_completed_rating,
      quality_delivery_performance_rating,
      timely_delivery_peformance_rating,
    } = user;

    let profile;
    const data = {
      ...user,
    };
    const userId = user.id;
    if (req.query.userType && req.query.userType !== '') {
      const { userType } = req.query;
      profile = await UserService.getUserTypeProfile(userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = userType;
      }
    } else if (user.userType !== 'admin') {
      profile = await UserService.getUserTypeProfile(user.userType, userId);
      if (profile) {
        data.profile = profile;
        data.userType = user.userType;
      }
    }

    const rating =
      user.userType === 'professional'
        ? avg_rating({
            years_of_experience_rating,
            certification_of_personnel_rating,
            no_of_staff_rating,
            complexity_of_projects_completed_rating,
            cost_of_projects_completed_rating,
            quality_delivery_performance_rating,
            timely_delivery_peformance_rating,
          })
        : undefined;

    const [[{ unread_messages }]] = await sequelize.query(
      `SELECT COUNT(*) as unread_messages FROM admin_messages where (user = 'all' OR user = :userType) AND (unread NOT LIKE :userId OR unread IS NULL)`,
      {
        replacements: {
          userType: req.query.userType ? req.query.userType : null,
          userId: `%${user.id}%`,
        },
      }
    );

    const referrals = await Referral.count({
      where: { userId: req.user.id },
    });

    return res.status(200).send({
      success: true,
      user: { ...data, rating, unread_messages, referrals },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.verifyUser = async (req, res, next) => {
  sequelize.transaction(async (transaction) => {
    try {
      const { email, token } = req.body;

      const user = await UserService.findUser({ email });

      console.log(user);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'No User found with this email',
        });
      }

      const data = {
        id: user.id,
        isActive: true,
        token: null,
      };
      await UserService.updateUser(data, transaction);
      return res.status(200).send({
        success: true,
        message: 'Account Activated Successfully',
        name: user.name ? user.name : user.fname,
        email: user.email,
      });
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  });
};

exports.verifyUserEmail = async (req, res, next) => {
  sequelize.transaction(async (transaction) => {
    try {
      const { email, token } = req.query;

      const user = await UserService.findUser({ email, token });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'No User found with this email',
        });
      }

      const data = {
        id: user.id,
        isActive: true,
        token: null,
      };
      await UserService.updateUser(data, transaction);
      return res.status(200).send({
        success: true,
        message: 'Account Activated Successfully',
        name: user.name ? user.name : user.fname,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      // transaction.rollback();
      return next(error);
    }
  });
};

exports.updateUserAccount = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const data = req.body;
      const userId = req.user.id;
      const user = await UserService.findUserById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Invalid user',
        });
      }

      if (req.file) {
        // const url = `${process.env.APP_URL}/${req.file.path}`;
        // data.photo = url;
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(req.file.path);
        const url = response.secure_url; // Get the secure URL from the response
        data.photo = url;
      }

      // const response = await cloudinary.upload(req);
      // console.log(response);

      console.log(data);
      data.id = userId;
      await UserService.updateUser(data, t);
      return res.status(201).send({
        success: true,
        message: 'Profile Updated Successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateUserProfile = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const data = req.body;
      const userId = req.user.id;
      const user = await UserService.findUserById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Invalid user',
        });
      }

      const where = {
        userId,
      };
      if (user.userType === 'professional') {
        let operation;
        let professional;
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === 'operation') {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            operation = url;
          }
          if (req.files[i].fieldname === 'professional') {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            professional = url;
          }
        }
        const requestData = {
          userId,
          company_name: data.company_name,
          company_address: data.company_address,
          certificate_of_operation: operation,
          professional_certificate: professional,
          years_of_experience: data.years,
        };
        await UserService.updateUserProfile(requestData, where, t);
      } else if (
        user.userType === 'vendor' ||
        user.userType === 'corporate_client'
      ) {
        const requestData = {
          userId,
          company_name: data.company_name,
          company_address: data.company_address,
          tin: data.tin,
          cac_number: data.cac_number,
          years_of_experience: data.years,
        };
        await UserService.updateUserProfile(requestData, where, t);
      }

      return res.status(201).send({
        success: true,
        message: 'Profile Updated Successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.changePassword = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          success: false,
          message: 'Passwords do not match',
        });
      }

      const user = await UserService.findUserById(id);

      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).send({
          success: false,
          message: 'Incorrect Old Password',
        });
      }
      const currentPassword = bcrypt.hashSync(newPassword, 10);
      const data = {
        password: currentPassword,
        id,
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        success: true,
        message: 'Password Changed Successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.forgotPassword = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { email } = req.query;

      const user = await UserService.findUser({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Invalid user',
        });
      }

      let token = '';
      if (req.body.platform === 'mobile') {
        token = helpers.generateMobileToken();
        await ClientForgotPasswordMobileMailer(
          { email, first_name: user.fname },
          token
        );
        // message = helpers.resetPasswordMobileMessage(token);
      } else {
        token = helpers.generateWebToken();
        await ClientForgotPasswordMailer(
          { email, first_name: user.fname },
          token
        );
        // let message = helpers.resetPasswordMessage(email, token);
      }
      // await EmailService.sendMail(email, message, "Reset Password");
      const data = {
        token,
        id: user.id,
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        success: true,
        message: 'Password Reset Email Sent Successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.resetPassword = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { email, token, password } = req.body;

      const user = await UserService.findUser({ token, email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Invalid user',
        });
      }

      const currentPassword = bcrypt.hashSync(password, 10);
      const data = {
        password: currentPassword,
        id: user.id,
      };
      await UserService.updateUser(data, t);
      return res.status(200).send({
        status: true,
        message: 'Password Changed Successfully',
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserService.findUser({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User found with this email',
      });
    }

    let token = helpers.generateWebToken();
    let message = helpers.verifyEmailMessage(user.name, email, token);
    if (req.body.platform === 'mobile') {
      token = helpers.generateMobileToken();
      message = helpers.mobileVerifyMessage(user.name, token);
    }

    await EmailService.sendMail(email, message, 'Verify Email');
    const data = {
      token,
      id: user.id,
    };
    await UserService.updateUser(data);

    return res.status(200).send({
      success: true,
      message: 'Token sent check email or mobile number',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: {
        [Op.ne]: 'admin',
      },
    };
    const userData = JSON.parse(
      JSON.stringify(await UserService.getAllUsers(where))
    );
    const usersAccounts = [];
    const users = await Promise.all(
      userData.map(async (customer) => {
        const accounts = await this.getAccountsData(customer.id);
        if (accounts.length > 1) {
          for (const account of accounts) {
            if (account.userType !== customer.userType) {
              const userEntity = await UserService.getUserTypeProfile(
                account.userType,
                customer.id
              );
              const customerData = { ...customer };
              customerData.userType = account.userType;
              customerData.profile = userEntity;
              usersAccounts.push({ user: customerData, accounts });
            }
          }
        }
        const profile = await UserService.getUserTypeProfile(
          customer.userType,
          customer.id
        );
        customer.profile = profile;
        return {
          user: customer,
          accounts: JSON.parse(JSON.stringify(accounts)),
        };
      })
    );
    const data = [...users, ...usersAccounts];
    return res.status(200).send({
      success: true,
      users: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.analyzeUser = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      let { y } = req.query;

      if (y === undefined) {
        y = new Date().getFullYear();
      }

      const usersByYear = await User.findAll({
        where: sequelize.where(
          sequelize.fn('YEAR', sequelize.col('createdAt')),
          y
        ),
      });

      return res.send({
        success: true,
        users: usersByYear,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getAllAdmin = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: 'admin',
    };
    const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getAllProjectAdmin = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: 'admin',
      level: 5,
    };
    const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getAllProductAdmin = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: 'admin',
      level: 4,
    };
    const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getAllGeneralAdmin = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: 'admin',
    };
    const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.getChatAdmins = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const superAdmins = await User.findAll({
      where: {
        userType: 'admin',
        level: 1,
      },
      order: [['createdAt', 'DESC']],
    });

    const productAdmins = await User.findAll({
      where: {
        userType: 'admin',
        level: 4,
      },
      order: [['createdAt', 'DESC']],
    });

    const projectAdmins = await User.findAll({
      where: {
        userType: 'admin',
        level: 5,
      },
      order: [['createdAt', 'DESC']],
    });

    const financialadmins = await User.findAll({
      where: {
        userType: 'admin',
        level: 3,
      },
      order: [['createdAt', 'DESC']],
    });

    const generaladmins = await User.findAll({
      where: {
        userType: 'admin',
        level: 6,
      },
      order: [['createdAt', 'DESC']],
    });

    let admin = {
      superAdmins: superAdmins[0],
      projectAdmin: projectAdmins[0],
      productAdmin: productAdmins[0],
      financialAdmin: financialadmins[0],
      generaladmins: generaladmins[0],
    };
    return res.status(200).send({
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.findAdmin = async (req, res) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const where = {
      userType: 'admin',
      id: req.params.adminId,
    };
    const admin = await User.findOne({ where });

    return res.status(200).send({
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }
    if (user.level === 1) {
      return res.status(401).send({
        success: false,
        message: 'UnAuthorised access',
      });
    }
    await User.destroy({ where: { id: userId } });

    const mesg = `The Admin ${user.email} rights has been revoked by super admin`;
    const notifyType = 'admin';
    const { io } = req.app;
    await Notification.createNotification({
      userId,
      type: notifyType,
      message: mesg,
    });
    io.emit('getNotifications', await Notification.fetchAdminNotification());

    return res.status(200).send({
      success: true,
      message: 'Admin Access revoked',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.findSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = JSON.parse(
      JSON.stringify(await UserService.findUserDetail({ id: userId }))
    );
    const profile = await UserService.getUserTypeProfile(
      req.query.userType,
      userData.id
    );
    userData.userType = req.query.userType;
    userData.profile = profile;

    const accounts = await this.getAccountsData(userId);

    const servicePartner = await ServicePartner.findOne({ where: { userId } });
    let ongoingProjects = [];
    let completedProjects = [];
    if (servicePartner !== null) {
      const projectDetails = await Projects.findAll({
        where: { serviceProviderId: servicePartner.id },
      });
      ongoingProjects = projectDetails.filter(
        (_detail) => _detail.status === 'ongoing'
      );
      completedProjects = projectDetails.filter(
        (_detail) => _detail.status === 'completed'
      );
    }

    const {
      years_of_experience_rating,
      certification_of_personnel_rating,
      no_of_staff_rating,
      complexity_of_projects_completed_rating,
      cost_of_projects_completed_rating,
      quality_delivery_performance_rating,
      timely_delivery_peformance_rating,
    } = userData;

    const rating =
      userData.userType === 'professional'
        ? avg_rating({
            years_of_experience_rating,
            certification_of_personnel_rating,
            no_of_staff_rating,
            complexity_of_projects_completed_rating,
            cost_of_projects_completed_rating,
            quality_delivery_performance_rating,
            timely_delivery_peformance_rating,
          })
        : undefined;

    return res.status(200).send({
      success: true,
      data: {
        user: userData,
        accounts,
        ongoingProjects,
        completedProjects,
        rating,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.addUserProfile = async (data, t) => {
  try {
    const { userType, userId, company_name, serviceTypeId } = data;
    const where = {
      userId,
    };
    if (userType === 'professional') {
      const request = {
        userId,
        company_name,
        userType: 'professional',
        serviceTypeId,
      };
      await ServicePartner.create(request, { transaction: t });
    } else if (userType === 'vendor') {
      const request = {
        userId,
        company_name,
        userType: 'vendor',
      };
      await ProductPartner.create(request, { transaction: t });
    } else if (userType === 'private_client') {
      const request = {
        userId,
        userType: 'private_client',
      };
      await PrivateClient.create(request, { transaction: t });
    } else if (userType === 'corporate_client') {
      const request = {
        userId,
        company_name,
        userType: 'corporate_client',
      };
      await CorporateClient.create(request, { transaction: t });
    }
    return true;
  } catch (error) {
    t.rollback();
    return error;
  }
};

exports.checkIfAccountExist = async (userType, userId) => {
  const where = {
    userId,
  };
  let user;
  if (userType === 'professional') {
    user = await ServicePartner.findOne({ where });
  } else if (userType === 'vendor') {
    user = await ProductPartner.findOne({ where });
  } else if (userType === 'private_client') {
    user = await PrivateClient.findOne({ where });
  } else if (userType === 'corporate_client') {
    user = await CorporateClient.findOne({ where });
  }
  return user;
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const update = {
      isSuspended: true,
      reason_for_suspension: reason,
    };

    const userdetails = await User.findOne({ where: { id: userId } });

    const super_admins = JSON.parse(
      JSON.stringify(
        await User.findAll({
          where: { userType: 'admin', level: 1, isActive: 1, isSuspended: 0 },
        })
      )
    );

    await User.update(update, { where: { id: userId } });

    // Mailer methods
    await AdminSuspendUserMailerForUser(
      { first_name: userdetails.first_name, email: userdetails.email },
      reason
    );
    await AdminSuspendUserMailerForAdmin(userdetails, super_admins, reason);

    return res.status(200).send({
      success: true,
      message: 'User suspended',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await UserService.getUserDetails({ id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    const update = {
      password: bcrypt.hashSync(password, 10),
    };

    await User.update(update, { where: { id } });

    return res.status(200).send({
      success: true,
      message: 'Password changed!',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserDetails({ id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }

    await User.destroy({ where: { id } });

    return res.status(200).send({
      success: true,
      message: 'User deleted!',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.unsuspendUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }
    if (user.userType !== 'admin') {
      return res.status(401).send({
        success: false,
        message: 'UnAuthorised access',
      });
    }
    const update = {
      isSuspended: false,
      isActive: true,
    };

    await User.update(update, { where: { id: userId } });

    return res.status(200).send({
      success: true,
      message: 'User suspended',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.adminCreateUpdateSocial = async (req, res, next) => {
  try {
    const { whatsapp, twitter } = req.body;

    // Validate whatsapp is an array of numbers
    if (
      whatsapp &&
      (!Array.isArray(whatsapp) ||
        !whatsapp.every((num) => typeof num === 'number'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'WhatsApp must be an array of numbers',
      });
    }

    // Validate twitter is an array of strings
    if (
      twitter &&
      (!Array.isArray(twitter) ||
        !twitter.every((str) => typeof str === 'string'))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Twitter must be an array of strings',
      });
    }

    const user = await UserService.getUserDetails({ id: req.user.id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }
    if (user.userType !== 'admin') {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Check if a SupportSocial entry already exists
    let supportSocial = await SupportSocial.findOne();

    if (supportSocial) {
      // Update existing entry
      if (whatsapp) {
        supportSocial.whatsapp = whatsapp;
      }

      if (twitter) {
        supportSocial.twitter = twitter;
      }

      await supportSocial.save();

      return res.status(200).send({
        success: true,
        message: 'Support social updated successfully',
        data: supportSocial,
      });
    } else {
      // Create new entry
      supportSocial = await SupportSocial.create({
        whatsapp,
        twitter,
      });

      return res.status(201).send({
        success: true,
        message: 'Support social created successfully',
        data: supportSocial,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.adminGetSupportSocial = async (req, res, next) => {
  try {
    const user = await UserService.getUserDetails({ id: req.user.id });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'No User Found',
      });
    }
    if (user.userType !== 'admin') {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const supportSocials = await SupportSocial.findOne();

    return res.status(200).send({
      success: true,
      data: supportSocials,
    });
  } catch (error) {
    return next(error);
  }
};

exports.userGetSupportSocial = async (req, res, next) => {
  try {
    const supportSocials = await SupportSocial.findOne();

    return res.status(200).send({
      success: true,
      data: supportSocials,
    });
  } catch (error) {
    return next(error);
  }
};

exports.userGetSupportSocial = async (req, res, next) => {
  try {
    const supportSocials = await SupportSocial.findOne();

    return res.status(200).send({
      success: true,
      data: supportSocials,
    });
  } catch (error) {
    return next(error);
  }
};
