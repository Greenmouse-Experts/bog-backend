"use strict";

const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");


const Chats = sequelise.define(
  "chats",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    sender_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    receiver_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    subadmin_room_no: {
      allowNull: true,
      type: Sequelize.NUMBER
    },
  },
  { paranoid: true }
);

User.hasMany(Chats, {
  foreignKey: "sender_id",
  as: "sender_details"
});
Chats.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender_details"
});

User.hasMany(Chats, {
  foreignKey: "receiver_id",
  as: "receiver_details"
});
Chats.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver_details"
});

module.exports = Chats;
