/* eslint-disable consistent-return */
require("dotenv").config();
const UserService = require('../service/UserService');

const {adminLevels, adminPrivileges} = require('../helpers/utility')

exports.verifyAccess = async (req, res, next) => {
    const {id} = req.user;
    const {path} = req.route;

    const userDetails = await UserService.findUser({id})

    if (Object.keys(userDetails).length === 0) {
        res.status(404).send({
            status: false,
            message: 'Admin not found!'
        })
    }
    else{

        // Level number 1 is for super admin role
        if (userDetails.level === 1 && userDetails.userType !== 'admin') {
            next();
        }
        else{
            // Get the level of the admin
            const levelDetails = adminLevels.find(_level => _level.level === userDetails.level);
            if (Object.keys(levelDetails).length === 0) {
                return res.status(404).send({
                    success: false,
                    message: 'Admin level does not exist!'
                })
            }
            else{
                // Get the privileges of the admin's level
                const _adminPrivileges = adminPrivileges.find(_privilege => _privilege.type === levelDetails.type);
                if (Object.keys(_adminPrivileges).length === 0) {
                    return res.status(404).send({
                        success: false,
                        message: `Admin with the level type ${type} is not recognized!`
,                   });
                }
                else{
                    const _path = _adminPrivileges.privileges.filter(_privilege => _privilege && path.includes(_privilege.toLowerCase()))
                  

                    if(_path.length === 0){
                        return res.status(403).send({
                            success: false,
                            message: `Access to this route is denied!`
                        })
                    }
                    else{
                        req._credentials = {
                            role: _adminPrivileges,
                            ...userDetails.toJSON()
                        }
                        next();
                    }
                }
            }
        }
    }

}

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
