/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database/connection");
const EmailService = require("./service/emailService");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const server = http.createServer(app);
require("./config/database/connection");
const moment = require("moment");
const Notification = require("./helpers/notification");

const cloudinary = require("./helpers/cloudinaryMediaProvider");

const logger = require("./helpers/ms-team/logger/logger");
const msTeamsService = require("./helpers/ms-team/ms-team-service");

const Routes = require("./routes");
const Subscription = require("./models/Subscription");
const ServicePartner = require("./models/ServicePartner");
const ProductPartner = require("./models/ProductPartner");
const ProductEarning = require("./models/ProductEarnings");
const {
  sendMessage,
  getUserChatMessagesApi,
  deleteMessage,
  markMessageRead,
  getUserConversations,
  test,
  getUserConversationsNew,
  getConversationMessage,
  getConversationMessages,
} = require("./controllers/ChatController");
// set up public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// //log file

// var fs = require("fs");
// var util = require("util");
// var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
// var log_stdout = process.stdout;

// console.log = function(d) {
//   //
//   log_file.write(util.format(d) + "\n");
//   log_stdout.write(util.format(d) + "\n");
// };

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   name: "mycookiesession",
//   cookie: { secure: false }
// }))

// Static Files
// dashboard
app.use("/uploads", express.static(`${__dirname}/uploads`));

app.use(morgan("combined"));

app.use(cors());
// body parse

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
// app.use(bodyParser.json({ limit: "20mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "20mb", extended: true, parameterLimit: 50000 }));
// app.use(bodyParser.raw({}));
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );


//to cancel error 413
// app.use(express.json({ limit: "20mb", extended: true }));
// app.use(
//   express.urlencoded({ limit: "20mb", extended: true, parameterLimit: 50000 })
// );

app.use(cookieParser());

const io = new Server(server, {
  allowEIO3: true, // false by default
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  transports: ["websocket", "polling"],
});

app.io = io;

app.get("/", (req, res) => {
  res.send(`BOG APP ${new Date()}`);
});

app.use("/api", Routes);
app.post("/upload", async (req, res, next) => {
  try {
    const response = await cloudinary.upload(req);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: "Problem occured!",
      error,
    });
  }
});
let onlineUsers = [];
io.on("connection", async (socket) => {
  console.log("New Connection", socket.id);
  io.emit("getNotifications", await Notification.fetchAdminNotification());
  io.emit(
    "getUserNotifications",
    await Notification.fetchUserNotificationApi(socket.handshake.query)
  );
  socket.on("notification_read", async (data) => {
    const { id } = data;
    socket.emit("markAsRead", await Notification.updateNotification(id));
  });

  // Add new user connection to online users and send to client
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    } else if (onlineUsers.some((user) => user.userId !== userId)) {
      onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
      console.log("Removed Prev Connection by User");
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log("New Connection by User", socket.id, onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  //send message
  socket.on("send_message", async (data) => {
    // io.in(room).emit("receive_message", data); // Send to all users in room, including sender

    // console.log("send message", data);

    // // Save message in db
    
    await sendMessage(data, socket, onlineUsers);

    // //check if reciever online
    // let user = onlineUsers.find((user) => user.userId === data.recieverId);
    // //if reciever is online emit to his socket the new message
    // if (user) {
    //   socket.user = user
    //   console.log(socket.user);

    //   await getUserConversations(data.recieverId, socket, user);
    // }
    // io.emit(
    //   "getNotifications",
    //   await Notification.fetchAdminNotification()
    // );

    // io.emit(
    //   "getUserNotifications",
    //   await Notification.fetchUserNotificationApi2(data.senderId)
    // );
  });

  socket.on("getUserChatMessages", async (data) => {
    console.log(data);
    io.emit("getUserChatMessages", async (data) => {
      console.log(data);

      await getUserChatMessagesApi(data);
    });
  });

  socket.on("getUserConversations", async (userId) => {
    // let { userId } = data;
    let user = onlineUsers.find((user) => user.userId === userId);
    //if reciever is online emit to his socket the new message
    if (user) {
      socket.user = user
      console.log(socket.user);

    io.emit(
      "getUserConversations",
      await getUserConversationsNew(userId, socket, user)
    );
    }
  });

   socket.on("getConversationMessages", async (data) => {
     let { userId, conversationId} = data;
     console.log('hello')
    console.log(userId)
     let user = onlineUsers.find((user) => user.userId === userId);
     //if reciever is online emit to his socket the new message
     if (user) {
      // console.log('h')
       socket.user = user;
      //  console.log(socket.user);

       
         await getConversationMessages(conversationId, socket, user)
       
     }
   });

  socket.on("readConversationMessages", (data) => {
    markMessageRead(data);

    io.emit("getUserChatMessages", (data) => {
      getUserChatMessagesApi(data);
    });
  });

  socket.on("deleteMessage", (data) => {
    const { messageId } = data;
    deleteMessage(messageId);
    io.emit("getUserChatMessages", (data) => {
      getUserChatMessagesApi(data);
    });
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    console.log("Online Users", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// scheduler for subscription
cron.schedule("* 6 * * *", () => {
  Subscription.findAll({
    where: { status: 1 },
  })
    .then(async (activeSubscriptions) => {
      // console.log(activeSubscriptions);
      await Promise.all(
        activeSubscriptions.map(async (sub) => {
          if (sub.expiredAt < moment()) {
            await Subscription.update({ status: 0 }, { where: { id: sub.id } });
            let user = await ServicePartner.findOne({
              where: { id: sub.userId },
            });
            const updateData = {
              hasActiveSubscription: false,
              planId: null,
            };
            if (user) {
              await ServicePartner.update(updateData, {
                where: { id: user.id },
              });
            } else {
              user = await ProductPartner.findOne({
                where: { id: sub.userId },
              });
              await ProductPartner.update(updateData, {
                where: { id: user.id },
              });
            }
          }
        })
      );
      console.log(`No Subscription updated`);
    })
    .catch((error) => {
      return null;
    });
  // }
});

// Handles all errors
app.use((err, req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      if (err.status === 412) {
        return res
          .status(err.status)
          .send({ success: false, message: err.message });
      }
      return res
        .status(err.status || 400)
        .send({ success: false, message: "An error occur" });
    }
    return res
      .status(err.status || 400)
      .send({ success: false, message: err.message, err });
  } catch (error) {
    return res
      .status(error.status || 400)
      .send({ success: false, message: error.message });
  }
});

// const teamCreationPayload = {
//   authorization: '',
//   teamName: '',
//   teamMembers: [{
//     userId: 'vkesakar@gmail.com',
//     role: 'admin'
//   },
//   {
//     userId: 'dummy_1@gmail.com',
//     role: 'admin'
//   }]
// }

// class Index {
//   async invoke () {
//     try {
//       const { message } = await msTeamsService.createTeam(teamCreationPayload)
//       logger.info('Index:invoke: Team created ', { message })
//     } catch (error) {
//       logger.error('Index:invoke: Error during team creation ', { error })
//     }
//   }
// }

// new Index()
//   .invoke()

// Not found route
app.use((req, res) => {
  return res.status(404).send({ success: false, message: "Route not found" });
});

sequelize.sync();
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
