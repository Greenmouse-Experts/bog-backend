const { capitalize } = require("lodash");
const { adminLevels } = require("../helpers/utility");
const { sendMessage, listMessages } = require("../service/chatService");

module.exports = async (socket) => {
  // List the sub administrators
  socket.on("list_admins", () => {
    socket.emit("listed_admins", adminLevels);
  });

  /**
   * User is typing
   * {string} name
   */
  socket.on("user_typing", (name) => {
    socket.emit("user_is_typing", { message: `${name} is typing...` });
  });

  /**
   * Send message to admin
   * {sender_id, receiver_id, message, url, subadmin_room_no}  body
   */
  socket.on("send_message", async (body) => {
    // Send message business logic
    const response = await sendMessage(body);
    socket.emit("message_sent", response);
  });


  socket.on("list_messages", async (admin_room) => {
    // business logic to get messages
    const chat_messages = await listMessages(admin_room);
    socket.emit("listed_messages", chat_messages);
  });

};
