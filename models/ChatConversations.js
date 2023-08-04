"use strict";

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const ChatMessages = require("./ChatMessages");


const ChatConversations = sequelise.define(
  "chatconversation",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    participantsId: {
      allowNull: false,
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("participantsId") !== undefined) {
          return JSON.parse(this.getDataValue("participantsId"));
        }
      },
      set(value) {
        this.setDataValue("participantsId", JSON.stringify(value));
      },
    },
    conversationtype: {
      allowNull: true,
      type: Sequelize.ENUM,
      values: ["general", "product", "project"],
      defaultValue: "general",
    },
  },
  { paranoid: true }
);



module.exports = ChatConversations;
