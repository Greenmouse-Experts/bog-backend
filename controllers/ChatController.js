/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Product = require("../models/Product");
const Project = require("../models/Project");
const ChatMessages = require("../models/ChatMessages");
const ChatConversations = require("../models/ChatConversations");

const ServicePartner = require("../models/ServicePartner");
const ProductPartner = require("../models/ProductPartner");
const User = require("../models/User");
// const cloudinary = require("../helpers/cloudinary");
const Reviews = require("../models/Reviews");
const Notification = require("../helpers/notification");
const {
  getUserTypeProfile,
  findUserById,
  getUserDetails,
} = require("../service/UserService");
const KycFinancialData = require("../models/KycFinancialData");
const Transaction = require("../models/Transaction");
const { Service } = require("../helpers/flutterwave");
const {
  ServicePartnerMailerForProjectPayout,
  AdminProjectPayoutMailer,
} = require("../helpers/mailer/samples");
const Notifications = require("../models/Notification");
const {
  checkExistingConversation,
  checkMessageType,
  chatControl,
} = require("../service/chatService");

// exports.getUserChatMessages = async (req, res, next) => {
//   try {
//     const { senderId, recieverId } = req.body;

//     const participantsId = [senderId, recieverId];

//     const convoId = await checkExistingConversation(participantsId);
//     console.log(convoId);

//     const where = {
//       conversationId: convoId,
//     };

//     let messages = JSON.parse(
//       JSON.stringify(
//         await ChatMessages.findAll({
//           where,
//           order: [["createdAt", "DESC"]],
//         })
//       )
//     );

//     return res.status(200).send({
//       success: true,
//       data: messages,
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

exports.getUserChatMessagesApi = async (data) => {
  try {
    console.log("f");

    const { senderId, recieverId } = data;

    const participantsId = [senderId, recieverId];

    const convoId = await checkExistingConversation(participantsId);
    console.log(convoId);

    const where = {
      conversationId: convoId,
    };

    let messages = JSON.parse(
      JSON.stringify(
        await ChatMessages.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );

    console.log(messages.length);

    return messages;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getUserChatMessagesApi = async (data) => {
  try {
    const { senderId, recieverId } = data;

    console.log(data);
    const participantsId = [senderId, recieverId];

    const convoId = await checkExistingConversation(participantsId);

    const where = {
      conversationId: convoId,
    };

    let messages = JSON.parse(
      JSON.stringify(
        await ChatMessages.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );

    let count = await ChatMessages.count({
      where,
      order: [["createdAt", "DESC"]],
    });

    console.log(count, "messages in conversation");

    return messages;
  } catch (error) {
    return error;
  }
};

const getUserConversations = async (userId) => {
  try {
   

    console.log(userId);


    const where = {
        participantsId: {
          [Op.like]: `%${userId}%`,
        },
      }

    let conversations = JSON.parse(
      JSON.stringify(
        await ChatConversations.findAll({
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: ChatMessages,
              attributes: {
                exclude: ["updatedAt"],
              },
              order: [["createdAt", "DESC"]],
            },
          ],
        })
      )
    );

    let count = await ChatConversations.count({
      where,
      order: [["createdAt", "DESC"]],
    });

    console.log(count, "Conversations had by this user");

    return conversations;
  } catch (error) {
    return error;
  }
};

exports.getUserConversations = async (userId) => {
  try {
    console.log(userId);

    const where = {
      participantsId: {
        [Op.like]: `%${userId}%`,
      },
    };

    let conversations = JSON.parse(
      JSON.stringify(
        await ChatConversations.findAll({
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: ChatMessages,
              attributes: {
                exclude: ["updatedAt"],
              },
              order: [["createdAt", "DESC"]],
            },
          ],
        })
      )
    );

    let count = await ChatConversations.count({
      where,
      order: [["createdAt", "DESC"]],
    });

    console.log(count, "Conversations had by this user");

    return conversations;
  } catch (error) {
    return error;
  }
};

exports.sendMessage = async (data, socket) => {
  sequelize.transaction(async (t) => {
    try {
      console.log(data);
      const { senderId, recieverId } = data;
      const participantsId = [senderId, recieverId];
      console.log(participantsId);

      if (senderId == null || senderId == "undefined") {
        console.log("senderId must exist");
        return "senderId must exist";
      }
      if (recieverId == null || recieverId == "undefined") {
        console.log("recieverId must exist");
        return "recieverId must exist";
      }
      if (senderId == recieverId) {
        console.log("cannot message self");
        return "cannot message self";
      }

      let senderAccountType;
      let recieverAccountType;

      //for sender
      const senderdetails = await getUserDetails({ id: senderId });
      const recieverdetails = await getUserDetails({ id: recieverId });
      if (senderdetails !== null && recieverdetails !== null) {
        //for reciever
        // const recieverdetails =  getUserDetails({ id: recieverId });

        if (senderdetails == "admin") {
          senderAccountType = "admin";
          recieverAccountType = "user";
        } else {
          senderAccountType = "user";
          recieverAccountType = "admin";
        }
        //check who is admin and check message type from admin type
        const conversationType = await checkMessageType(participantsId);
        if (conversationType == false) {
          console.log("someone must be an admin");
          return false;
        }

        const chatControlCheck = await chatControl(data, conversationType);
        if (chatControlCheck !== true) {
          return false;
        }
        const conversationCheck = await checkExistingConversation(
          participantsId
        );
let saveMessage
        if (conversationCheck == false) {
          //create new conversations with participants

          const convo = {
            participantsId: participantsId,
            conversationType: conversationType.messageType,
          };
          const conversation = await ChatConversations.create(convo, {
            transaction: t,
          });

          data.conversationId = conversation.id;
          saveMessage = await ChatMessages.create(data, {
            transaction: t,
          });
        } else {
          //In case conversation already exists

          data.conversationId = conversationCheck;

           saveMessage = await ChatMessages.create(data, {
            transaction: t,
          });
        }

        const mesg = `A ${senderAccountType} ${senderId} just sent you a message`;
        const userId = recieverId;
        const notifyType = recieverAccountType;
        await Notification.createNotification({
          userId,
          type: notifyType,
          message: mesg,
        });

        // setTimeout(async () => {
        //   socket.emit("getChatMessagesApi", await getUserChatMessagesApi(data));
        // }, 500);

         setTimeout(async () => {
           socket.emit(
             "sentMessage",
             saveMessage
           );
         }, 200);

          setTimeout(async () => {
            socket.emit("getUserConversations", getUserConversations(recieverId));
          }, 200);

        return "message sent";
      } else {
        return "Both sender and reciever must be valid users";
      }
    } catch (error) {
      console.log(error);
      t.rollback();
      return error;
    }
  });
};

exports.markMessageRead = async (data) => {
  sequelize.transaction(async (t) => {
    try {
      const { senderId, recieverId, conversationId } = data;
      const message = await ChatMessages.findAll({
        where: { conversationId, recieverId: senderId },
      });

      await ChatMessages.update(
        { read: true },
        { where: { conversationId, recieverId: senderId }, transaction: t }
      );
      return "Message Deleted";
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteMessage = async (messageId) => {
  sequelize.transaction(async (t) => {
    try {
      const message = await ChatMessages.findOne({
        where: { id: messageId },
      });

      await ChatMessages.destroy({ where: { id: messageId }, transaction: t });
      return "Message Deleted";
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};
