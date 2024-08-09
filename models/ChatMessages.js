"use strict";

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ChatConversations = require("./ChatConversations");

const ChatMessages = sequelise.define(
  "chatmessage",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    conversationId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recieverId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    attachment: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  { paranoid: true }
);


ChatConversations.hasMany(ChatMessages, {
  foreignKey: "conversationId",
  as: "chatMessages",
});

ChatMessages.belongsTo(ChatConversations, {
  foreignKey: "conversationId",
  as: "chatConversation",
});



module.exports = ChatMessages;
