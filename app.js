/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const cron = require("node-cron");

const server = http.createServer(app);
require("./config/database/connection");

const Routes = require("./routes");

app.use(morgan("combined"));

app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
  res.send(`BOG APP ${new Date()}`);
});

app.use("/api", Routes);

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
