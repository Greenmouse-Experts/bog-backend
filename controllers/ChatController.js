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
const { error } = require("winston");
const { notify } = require("../routes");
const { adminLevelCheck } = require("../helpers/utility");

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

const getUserConversations = async (userId, socket) => {
  try {
    // console.log(userId);

    const where = {
      participantsId: {
        [Op.like]: `%${userId}%`,
      },
    };

    let conversations = await ChatConversations.findAll({
      where: where,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: ChatMessages,
          as: "chatMessages",
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["createdAt", "deletedAt"],
          },
        },
      ],
    }).then(async (conversations) => {
      conversations = JSON.parse(JSON.stringify(conversations));
      // console.log("getUserConversations", conversations);
      socket.emit("getUserConversations", conversations);
    });

    // console.log("hello");

    const count = await ChatConversations.count({
      where: where,
    });

    // setTimeout(async () => {
    //   socket.emit("getUserConversations", conversations);
    // }, 300);
    console.log(count, "Conversations had by this user");

    return conversations;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.getUserConversations = async (userId, socket) => {
  try {
    console.log(userId);

    let usercheck = await findUserById(userId);
    if (!usercheck) {
      return false;
    }
    let conversations;
    let count;
    let where;
    if (usercheck.userType == "admin") {
      let adminLevel = adminLevelCheck.find(
        (admin) => admin.level === usercheck.level
      );

      if (adminLevel) {
        console.log(adminLevel);

        where = {
          conversationtype: adminLevel.type,
        };
        conversations = JSON.parse(
          JSON.stringify(
            await ChatConversations.findAll({
              where: where,
              include: [
                {
                  model: ChatMessages,
                  as: "chatMessages",
                  order: [["createdAt", "DESC"]],
                  attributes: {
                    exclude: ["createdAt", "deletedAt"],
                  },
                },
              ],
              order: [
                [
                  { model: ChatMessages, as: "chatMessages" },
                  "createdAt",
                  "DESC",
                ],
              ],
            })
          )
        );

        count = await ChatConversations.count({
          where: where,
        });
      } else {
        //if it can't find adminlevel
        return false;
      }
    } else {
      //if not admin
      where = {
        participantsId: {
          [Op.like]: `%${userId}%`,
        },
      };

      conversations = JSON.parse(
        JSON.stringify(
          await ChatConversations.findAll({
            where: where,
            include: [
              {
                model: ChatMessages,
                as: "chatMessages",
                order: [["createdAt", "DESC"]],
                attributes: {
                  exclude: ["createdAt", "deletedAt"],
                },
              },
            ],
            order: [
              [
                { model: ChatMessages, as: "chatMessages" },
                "createdAt",
                "DESC",
              ],
            ],
          })
        )
      );

      count = await ChatConversations.count({
        where: where,
      });
    }

    // console.log("hello");

    setTimeout(async () => {
      socket.emit("getUserConversations", conversations);
    }, 300);
    console.log(count, "Conversations had by this user");

    return conversations;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.getUserConversationsNew = async (userId, socket, user) => {
  try {
    console.log(userId, user);

    console.log(userId);

    let usercheck = await findUserById(userId);
    if (!usercheck) {
      return false;
    }
    let conversations;
    let count;
    let where;
    if (usercheck.userType == "admin") {
      let adminLevel = adminLevelCheck.find(
        (admin) => admin.level === usercheck.level
      );

      if (adminLevel) {
        console.log(adminLevel);

        where = {
          conversationtype: adminLevel.type,
        };
        conversations = JSON.parse(
          JSON.stringify(
            await ChatConversations.findAll({
              where: where,
              include: [
                {
                  model: ChatMessages,
                  as: "chatMessages",
                  order: [["createdAt", "DESC"]],
                  attributes: {
                    exclude: ["createdAt", "deletedAt"],
                  },
                },
              ],
              order: [
                [
                  { model: ChatMessages, as: "chatMessages" },
                  "createdAt",
                  "DESC",
                ],
              ],
            })
          )
        );

        count = await ChatConversations.count({
          where: where,
        });
      } else {
        //if it can't find adminlevel
        return false;
      }
    } else {
      //if not admin
      where = {
        participantsId: {
          [Op.like]: `%${userId}%`,
        },
      };

      conversations = JSON.parse(
        JSON.stringify(
          await ChatConversations.findAll({
            where: where,
            include: [
              {
                model: ChatMessages,
                as: "chatMessages",
                order: [["createdAt", "DESC"]],
                attributes: {
                  exclude: ["createdAt", "deletedAt"],
                },
              },
            ],
            order: [
              [
                { model: ChatMessages, as: "chatMessages" },
                "createdAt",
                "DESC",
              ],
            ],
          })
        )
      );

      count = await ChatConversations.count({
        where: where,
      });
    }

    setTimeout(async () => {
      // socket.emit("getUserConversations", conversations);
      socket.to(user.socketId).emit("getUserConversations", conversations);
    }, 300);

    return conversations;
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.getConversationMessages = async (conversationId, socket, user) => {
  try {
    const { userId } = user;
    console.log(userId, user);

    console.log(userId);

    let usercheck = await findUserById(userId);
    if (!usercheck) {
      return false;
    }
    let conversations;
    let count;
    let where;

    where = {
      id: conversationId,
    };
    conversations = JSON.parse(
      JSON.stringify(
        await ChatConversations.findOne({
          where: where,
          include: [
            {
              model: ChatMessages,
              as: "chatMessages",
              order: [["createdAt", "DESC"]],
              attributes: {
                exclude: ["deletedAt"],
              },
            },
          ],
          order: [
            [{ model: ChatMessages, as: "chatMessages" }, "createdAt", "DESC"],
          ],
        })
      )
    );
if(conversations == null || conversations.length < 1){
  console.log('no chats with conversationId')
  return false
}
    count = await ChatMessages.count({
      where: {conversationId},
    });
console.log(user.socketId)
console.log(count, conversations);
    setTimeout(async () => {
      // socket.emit("getUserConversations", conversations);
      socket.to(user.socketId).emit("getConversationMessages", conversations);
    }, 100);

    return conversations;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// exports.getUserConversations = async (userId) => {
//   try {
//     console.log(userId);

//     const where = {
//       participantsId: {
//         [Op.like]: `%${userId}%`,
//       },
//     };
//     console.log(userId);

//     let conversations = JSON.parse(
//       JSON.stringify(
//         await ChatConversations.findAll({
//           where,
//           order: [["createdAt", "DESC"]],
//           include: [
//             {
//               model: ChatMessages,
//               attributes: {
//                 exclude: ["updatedAt"],
//               },
//             },
//           ],
//         })
//       )
//     );
//     console.log(conversations);
//     console.log(userId);

//     let count = await ChatConversations.count({
//       where,
//       order: [["createdAt", "DESC"]],
//     });

//     console.log(count, "Conversations had by this user");

//     return conversations;
//   } catch (error) {
//     return error;
//   }
// };

// exports.sendMessage = async (data, socket, onlineUsers) => {
//   sequelize.transaction(async (t) => {
//     try {
//       console.log(data);
//       const { senderId, recieverId } = data;
//       const participantsId = [senderId, recieverId];
//       console.log(participantsId);

//       if (senderId == null || senderId == "undefined") {
//         console.log("senderId must exist");
//         return "senderId must exist";
//       }
//       if (recieverId == null || recieverId == "undefined") {
//         console.log("recieverId must exist");
//         return "recieverId must exist";
//       }
//       if (senderId == recieverId) {
//         console.log("cannot message self");
//         return "cannot message self";
//       }

//       let senderAccountType;
//       let recieverAccountType;

//       //for sender
//       const senderdetails = await getUserDetails({ id: senderId });
//       const recieverdetails = await getUserDetails({ id: recieverId });
//       if (senderdetails !== null && recieverdetails !== null) {
//         //for reciever
//         // const recieverdetails =  getUserDetails({ id: recieverId });

//         //to get who is the user amongt chat participants
//         let conversationUserId;
//         if (senderdetails == "admin") {
//           senderAccountType = "admin";
//           recieverAccountType = "user";

//           //assign who is user
//           conversationUserId = recieverId;
//         } else {
//           senderAccountType = "user";
//           recieverAccountType = "admin";

//           //assign who is user
//           conversationUserId = senderId;
//         }
//         //check who is admin and check message type from admin type
//         const conversationType = await checkMessageType(participantsId);
//         if (conversationType == false) {
//           console.log("someone must be an admin");
//           return false;
//         }

//         const chatControlCheck = await chatControl(data, conversationType);
//         if (chatControlCheck !== true) {
//           return false;
//         }
//         const conversationCheck = await checkExistingConversation(
//           participantsId
//         );
//         let saveMessage;
//         if (conversationCheck == false) {
//           //create new conversations with participants

//           const convo = {
//             userId: conversationUserId,
//             participantsId: participantsId,
//             conversationType: conversationType.messageType,
//           };
//           const conversationcreate = await ChatConversations.create(convo, {
//             transaction: t,
//           });
//           // console.log(conversationcreate)

//           data.conversationId = conversationcreate.id;
//           data.conversationType = conversationcreate.conversationtype;
//           saveMessage = await ChatMessages.create(data, {
//             transaction: t,
//           });
//         } else {
//           //In case conversation already exists

//           data.conversationId = conversationCheck;

//           saveMessage = await ChatMessages.create(data, {
//             transaction: t,
//           });
//         }
//         // console.log(data)
//         let id = data.conversationId;
//         const where = {
//           id,
//         };
//         const up = await ChatConversations.update(
//           {
//             conversationtype: data.conversationtype,
//           },
//           {
//             where,
//             transaction: t,
//           }
//         );

//         let conversation = await ChatConversations.findOne({
//           where: { id: data.conversationId },
//         });

//         // setTimeout(async () => {
//         //   socket.emit("getChatMessagesApi", await getUserChatMessagesApi(data));
//         // }, 500);
//         setTimeout(() => {
//           socket.emit("sentMessage", saveMessage);
//         }, 100);
//         console.log("sentMessage");

//         //for loop : for all partcipants in chat, check if online, if yes emit get conversation to their socket Ids
//         console.log(conversation.participantsId);
//         console.log(onlineUsers);
//         for (let i = 0; i < conversation.participantsId.length; i++) {
//           let onlineuser = onlineUsers.find(
//             (user) => user.userId === conversation.participantsId[i]
//           );
//           //if participant is online emit to his socket the new message
//           if (onlineuser) {
//             console.log(conversation.participantsId[i] + "is online");

//             setTimeout(async () => {
//               await this.getUserConversationsNew(
//                 conversation.participantsId[i],
//                 socket,
//                 onlineuser
//               );
//             }, 100);
//           }
//         }

//         //to know wether to send the notification to user or admins
//         const notifysender = await findUserById(senderId);

//         if (notifysender.userType == "admin") {
//           const mesg = `A ${senderAccountType} ${senderId} just sent you a message`;
//           const userId = recieverId;
//           const notifyType = "user";
//           await Notification.createNotification({
//             userId,
//             type: notifyType,
//             message: mesg,
//           });

//           //To all admin
//           const mesgAdmin = `A ${data.conversationType} admin just sent a message to a user `;
//           const userIdAdmin = senderId;
//           const notifyTypeAdmin = "admin";
//           // const { io } = req.app;
//           await Notification.createNotification({
//             userId: userIdAdmin,
//             type: notifyTypeAdmin,
//             message: mesgAdmin,
//           });
//         } else {
//           //if sender is a user
//           //To all admin
//           const mesgAdmin2 = `A ${data.conversationType} user just sent a message `;
//           const userIdAdmin2 = senderId;
//           const notifyTypeAdmin2 = "admin";
//           // const { io } = req.app;
//           await Notification.createNotification({
//             userId: userIdAdmin2,
//             type: notifyTypeAdmin2,
//             message: mesgAdmin2,
//           });
//         }

//         setTimeout(async () => {
//           socket.emit(
//             "getNotifications",
//             await Notification.fetchAdminNotification()
//           );
//         }, 200);

//         // console.log("message sent")
//         return saveMessage;
//       } else {
//         return "Both sender and reciever must be valid users";
//       }
//     } catch (error) {
//       console.log(error);
//       t.rollback();
//       return error;
//     }
//   });
// };

exports.markMessagesRead = async (conversationId) => {
  sequelize.transaction(async (t) => {
    try {

      const message = await ChatMessages.findAll({
        where: { conversationId },
      });

      await ChatMessages.update(
        { read: true },
        { where: { conversationId }, transaction: t }
      );
      return true;
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
      return true;
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

// exports.test = async () => {
//   sequelize.transaction(async (t) => {
//     new Promise(function(resolve, reject) {
//       try {
//         const newt = {
//           mike: "fff",
//         };
//         resolve(newt);
//       } catch (error) {
//         console.log(error);
//         t.rollback();
//         reject(error);
//       }
//     });
//   });
// };

exports.sendMessage = async (data, socket, onlineUsers) => {
  // sequelize.transaction(async (t) => {
  try {
    console.log(data);
    const { senderId, recieverId } = data;
    // const participantsId = [senderId, recieverId];
    // console.log(participantsId);

    if (senderId == recieverId) {
      console.log("user cant message self");
      return "user cant message self";
    }

    //for sender
    const senderdetails = await getUserDetails({
      id: senderId,
    });
    const recieverdetails = await getUserDetails({
      id: recieverId,
    });
    // console.log(senderdetails)
    // console.log(recieverdetails);
    if (senderdetails == null || recieverdetails == null) {
      console.log("Both sender and user must be valid users");
      return "Both sender and reciever must be valid users";
    }
    if (
      senderdetails.userType !== "admin" &&
      recieverdetails.userType !== "admin"
    ) {
      console.log("One must be an admin");
      return "Two users cant message each other";
    }
    let saveMessage;
    let conversationUserId;
    let conversation;
    if (senderdetails.userType == "admin") {
      senderAccountType = "admin";
      recieverAccountType = "user";

      //assign who is user
      conversationUserId = recieverId;
    } else {
      senderAccountType = "user";
      recieverAccountType = "admin";

      //assign who is user
      conversationUserId = senderId;
    }
    if (data.conversationId) {
      console.log("conversation Id exists");
      conversation = await ChatConversations.findOne({
        where: { id: data.conversationId },
      });
      if (conversation == null) {
        console.log("Send Valid Converdation Id");

        return "Send Valid Converdation Id";
      }
      //if conversation exists with convoid
      if (senderdetails.userType == "admin") {
        //if sender is admin
        console.log("sender is admin");

        //then check is user is correct
        console.log(conversation);
        if (conversation.userId !== recieverId) {
          console.log("Wrong recieverId");
          return "Wrong recieverId";
        }
        let adminLevel = adminLevelCheck.find(
          (admin) => admin.type === conversation.conversationtype
        );

        if (!adminLevel) {
          console.log("admin cant join convo");
          return "Type of admin cant join this conversation";
        }

        //  console.log(conversationType);
        // check if admin exist in participant id if no add it
        const elementExists = conversation.participantsId.includes(senderId);
        let newparticipantsId = [];
        if (!elementExists) {
          for (let d = 0; d < conversation.participantsId.length; d++) {
            newparticipantsId.push(conversation.participantsId[d]);
          }
          newparticipantsId.push(senderId);
          console.log("new partcipant Id" + newparticipantsId);

          console.log(conversation.participantsId);
          let up = await ChatConversations.update(
            {
              conversationtype: data.conversationtype,
              participantsId: newparticipantsId,
            },
            {
              where: { id: data.conversationId },
              // transaction: t,
            }
          );
        }
        //  data.userId = conversation.userId;

        saveMessage = await ChatMessages.create(data, {
          // transaction: t,
        });
      } else {
        //user is the sender
        console.log("user is the sender");
        if (conversation.userId !== senderId) {
          console.log("senderId isnt same with user in conversation");
          return "senderId isnt same with user in conversation";
        }

        //  data.userId = conversation.userId;
        saveMessage = await ChatMessages.create(data, {
          // transaction: t,
        });
        // let conversationType = await checkMessageType(conversation.participantsId);
        // if (conversationType == false) {
        //   console.log("someone must be an admin");
        //   return false;
        // }
      }
    } else {
      //if convoId doesnt exist
      console.log("conversation doesnt exist");
      const participantsId = [senderId, recieverId];

      //check who is admin and check message type from admin type
      let conversationType = await checkMessageType(participantsId);
      if (conversationType == false) {
        console.log("someone must be an admin");
        return false;
      }

      console.log(conversationType);
      const chatControlCheck = await chatControl(data, conversationType);
      if (chatControlCheck !== true) {
        return false;
      }

      const convo = {
        userId: conversationUserId,
        participantsId: participantsId,
        conversationtype: conversationType.messageType,
      };
      const newConversation = await ChatConversations.create(convo, {
        // transaction: t,
      });
      console.log(newConversation);

      data.conversationId = newConversation.id;
      data.conversationType = newConversation.conversationtype;
      saveMessage = await ChatMessages.create(data, {
        // transaction: t,
      });
      console.log(data, data.conversationId);
      let id = data.conversationId;
      const where = {
        id: data.conversationId,
      };
      let up = await ChatConversations.update(
        {
          conversationtype: data.conversationtype,
        },
        {
          where,
          // transaction: t,
        }
      );

      console.log(up);
      console.log(data);

      conversation = await ChatConversations.findOne({
        where: { id: data.conversationId },
      });
      console.log("exists", conversation);
    }

    setTimeout(() => {
      socket.emit("sentMessage", saveMessage);
    }, 100);
    console.log("sentMessage");

    console.log(conversation.participantsId);
    console.log(onlineUsers);
    for (let i = 0; i < conversation.participantsId.length; i++) {
      let onlineuser = onlineUsers.find(
        (user) => user.userId === conversation.participantsId[i]
      );
      //if participant is online emit to his socket the new message
      if (onlineuser) {
        console.log(conversation.participantsId[i] + "is online");

        setTimeout(async () => {
          await this.getUserConversationsNew(
            conversation.participantsId[i],
            socket,
            onlineuser
          );
        }, 100);
      }
    }

    //to know wether to send the notification to user or admins
    const notifysender = await findUserById(senderId);

    if (notifysender.userType == "admin") {
      const mesg = `A ${senderAccountType} ${senderId} just sent you a message`;
      const userId = recieverId;
      const notifyType = "user";
      await Notification.createNotification({
        userId,
        type: notifyType,
        message: mesg,
      });

      //To all admin
      const mesgAdmin = `A ${data.conversationType} admin just sent a message to a user `;
      const userIdAdmin = senderId;
      const notifyTypeAdmin = "admin";
      // const { io } = req.app;
      await Notification.createNotification({
        userId: userIdAdmin,
        type: notifyTypeAdmin,
        message: mesgAdmin,
      });
    } else {
      //if sender is a user
      //To all admin
      const mesgAdmin2 = `A ${data.conversationType} user just sent a message `;
      const userIdAdmin2 = senderId;
      const notifyTypeAdmin2 = "admin";
      // const { io } = req.app;
      await Notification.createNotification({
        userId: userIdAdmin2,
        type: notifyTypeAdmin2,
        message: mesgAdmin2,
      });
    }

    setTimeout(async () => {
      socket.emit(
        "getNotifications",
        await Notification.fetchAdminNotification()
      );
    }, 200);

    // console.log("message sent")
    return saveMessage;
  } catch (error) {
    console.log(error);
    // t.rollback();
    return error;
  }
  // });
};
