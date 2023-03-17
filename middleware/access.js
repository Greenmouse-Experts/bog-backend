/* eslint-disable no-lonely-if */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
require("dotenv").config();
const axios = require("axios");
const UserService = require("../service/UserService");
const User = require("../models/User");

const { adminLevels, adminPrivileges } = require("../helpers/utility");

exports.verifyAccess = async (req, res, next) => {
  const { id } = req.user;
  const { path } = req.route;

  try {
    const userDetails = await User.findOne({ where: { id } });

    if (userDetails === null) {
      res.status(404).send({
        status: false,
        message: "Admin not found!",
      });
    } else {
      // Level number 1 is for super admin role
      if (userDetails.level === 1 || userDetails.userType !== "admin") {
        req._credentials = {
          ...userDetails.toJSON(),
        };
        next();
      } else {
        // Get the level of the admin
        const levelDetails = adminLevels.find(
          (_level) => _level.level === userDetails.level
        );
        if (Object.keys(levelDetails).length === 0) {
          return res.status(404).send({
            success: false,
            message: "Admin level does not exist!",
          });
        }

        // Get the privileges of the admin's level
        const _adminPrivileges = adminPrivileges.find(
          (_privilege) => _privilege.type === levelDetails.type
        );
        if (Object.keys(_adminPrivileges).length === 0) {
          return res.status(404).send({
            success: false,
            message: `Admin with the level type ${type} is not recognized!`,
          });
        }

        const _path = _adminPrivileges.privileges.filter(
          (_privilege) => _privilege && path.includes(_privilege.toLowerCase())
        );

        if (_path.length === 0) {
          return res.status(403).send({
            success: false,
            message: `Access to this route is denied!`,
          });
        }

        req._credentials = {
          role: _adminPrivileges,
          ...userDetails.toJSON(),
        };
        next();
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: false,
      error,
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  const { _credentials } = req;

  if (_credentials.userType !== "admin") {
    return res.status(403).send({
      status: false,
      message: "Unauthorized Access!",
    });
  } else {
    next();
  }
};

exports.verifyUser = (req, res, next) => {
  const { _credentials } = req;

  if (_credentials.userType === "admin") {
    return res.status(403).send({
      status: false,
      message: "Unauthorized Access!",
    });
  } else {
    next();
  }
};

exports.authenticateFBSignup = async (req, res, next) => {
  try {
    const { facebook_access_token } = req.body;
    const { data } = await axios({
      url: "https://graph.facebook.com/me",
      method: "get",
      params: {
        fields: ["id", "email", "first_name", "last_name"].join(","),
        access_token: facebook_access_token,
      },
    });
    // console.log(data); // { id, email, first_name, last_name }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "FB access error",
    });
  }
};

exports.authenticateGoogleSignin = async (req, res, next) => {
  try {
    const { access_token } = req.body;
    console.log(access_token)
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    if (data.verified_email === false) {
      return res.status(400).json({
        success: true,
        message: "This email address is not verified!",
      });
    }

    req.google_details = data;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Google auth access error",
    });
  }
};
// module.exports = function(req, res, next) {
//   const token = req.header("authorization");
//   if (!token) {
//     return res.status(401).send({
//       success: false,
//       message: "Access Denied"
//     });
//   }

//   // verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     return res.status(401).send({
//       success: false,
//       message: "Token is not valid"
//     });
//   }
// };
