/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const sequelize = require("../config/database/connection");
const Complaints = require("../models/complaints");
const User = require("../models/User");
const Notification = require("../helpers/notification");

const {ticket_issues} = require("../helpers/utility")


exports.CreateComplaint = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const {user} = req;
      const {user_type, title, description, issue_type} = req.body;

      const issue_no = `I${String(Math.random()).split('.')[1]}`
      // default
      let status = 'open';
      const user_id = req.user.id;
      const data = {
        issue_no,
        user_id,
        title,
        description,
        issue_type,
        user_type, status
      };
      const complaint = await Complaints.create(data, {
        transaction: t
      });

      // Notification
      const mesg = `${user.name} made a complaint on the ${issue_type} issue category`;
      const notifyType = "admin";
      const { io } = req.app;
      await Notification.createNotification({
        type: notifyType,
        message: mesg,
        user_id
      });
      io.emit("getNotifications", await Notification.fetchAdminNotification());

      return res.status(200).send({
        success: true,
        data: complaint
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getIssuesCategory = async (req, res, next) => {
  return res.json({
    success: true,
    data: ticket_issues
  })
};

exports.getUserComplaints = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {

      const {user_id} = req.params;
      const complaints_ = await Complaints.findAll({where: {user_id}});
      return res.json({
        success: true,
        data: complaints_
      })

     } catch (error) {
      t.rollback();
      return next(error);
    }
  })
};

exports.getComplaints = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {

      const complaints_ = await Complaints.findAll();
      return res.json({
        success: true,
        data: complaints_
      })

     } catch (error) {
      t.rollback();
      return next(error);
    }
  })
};

exports.updateComplaint = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {

      const {id} = req.params;
      const complaint = await Complaints.findOne({where: {id}});

      const {response_note} = req.body;
      let status = 'closed';

      if(!complaint){
        return res.status(404).json({
          success: false,
          message: "Complaint details not found!"
        })
      }

      // Update complaint
      await Complaints.update({status, response_note}, {where: {id}});
      return res.json({
        success: true,
        message: "Complaints updated!"
      })

     } catch (error) {
      t.rollback();
      return next(error);
    }
  })
}
// exports.getHompageTestimonies = async (req, res, next) => {
//   try {
//     const testimony = await Testimony.findAll({
//       where: { isHomePage: true },
//       order: [["createdAt", "DESC"]],
//       include: [
//         {
//           model: User,
//           as: "user",
//           attributes: ["id", "name", "photo", "userType"]
//         }
//       ]
//     });
//     return res.status(200).send({
//       success: true,
//       data: testimony
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.getUserTestimony = async (req, res, next) => {
//   try {
//     const testimony = await Testimony.findOne({
//       where: { userId: req.user.id },
//       include: [
//         {
//           model: User,
//           as: "user",
//           attributes: ["id", "name", "photo", "userType"]
//         }
//       ]
//     });
//     return res.status(200).send({
//       success: true,
//       data: testimony
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.updateIsHomepage = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { testimonyId } = req.params;
//       const getTestimony = await Testimony.findOne({
//         where: { id: testimonyId }
//       });
//       if (!getTestimony) {
//         return res.status(404).send({
//           success: false,
//           message: "Testimony Not Found"
//         });
//       }

//       await Testimony.update(
//         { isHomepage: !getTestimony.isHomepage },
//         {
//           where: { id: testimonyId },
//           transaction: t
//         }
//       );
//       if (getTestimony.isHomepage === false) {
//         // Notification
//         const { userId } = getTestimony;
//         const mesg = `Your testimonial has been published to home page`;
//         const notifyType = "user";
//         const { io } = req.app;
//         await Notification.createNotification({
//           type: notifyType,
//           message: mesg,
//           userId
//         });
//         io.emit(
//           "getNotifications",
//           await Notification.fetchUserNotificationApi({ userId })
//         );
//       }
//       return res.status(200).send({
//         success: true,
//         data: getTestimony
//       });
//     } catch (error) {
//       return next(error);
//     }
//   });
// };

// exports.updateTestimony = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { testimonyId, isHomePage, ...update } = req.body;
//       const getTestimony = await Testimony.findOne({
//         where: { id: testimonyId }
//       });
//       if (!getTestimony) {
//         return res.status(404).send({
//           success: false,
//           message: "Testimony Not Found"
//         });
//       }
//       await Testimony.update(update, {
//         where: { id: testimonyId },
//         transaction: t
//       });
//       return res.status(200).send({
//         success: true,
//         data: getTestimony
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };

// exports.deleteTestimony = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { testimonyId } = req.params;
//       const getTestimony = await Testimony.findOne({
//         where: { id: testimonyId }
//       });
//       if (!getTestimony) {
//         return res.status(404).send({
//           success: false,
//           message: "Testimony Not Found"
//         });
//       }
//       await Testimony.destroy({ where: { id: testimonyId }, transaction: t });
//       return res.status(200).send({
//         success: true,
//         message: "Testimony deleted successfully"
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };
