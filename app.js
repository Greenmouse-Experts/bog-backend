/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const bodyParser = require("body-parser");

const server = http.createServer(app);
require("./config/database/connection");
const Notification = require("./helpers/notification");

const Routes = require("./routes");
// set up public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
// Static Files
// dashboard
app.use("/uploads", express.static(`${__dirname}/uploads`));
app.use("/uploads/invoice", express.static(`${__dirname}/uploads/invoice`));

app.use(morgan("combined"));

app.use(cors());
// body parse
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.raw({}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

app.io = io;

app.get("/", (req, res) => {
  res.send(`BOG APP ${new Date()}`);
});

app.use("/api", Routes);

io.on("connection", async socket => {
  // console.log(socket);
  io.emit("getNotifications", await Notification.fetchAdminNotification());
  io.emit(
    "getUserNotifications",
    await Notification.fetchUserNotificationApi(socket.handshake.query)
  );
  socket.on("notification_read", async data => {
    console.log(data);
    const { id } = data;
    socket.emit("markAsRead", await Notification.updateNotification(id));
  });
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

// Not found route
app.use((req, res) => {
  return res.status(404).send({ success: false, message: "Route not found" });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
