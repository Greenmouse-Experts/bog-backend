require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.zoomGenerator = async email => {
  const payload = {
    iss: process.env.ZOOM_API_KEY, // your API KEY
    exp: new Date().getTime() + 5000
  };
  const token = jwt.sign(payload, process.env.ZOOM_API_SECRET); // your API SECRET HERE
  const uri = `https://api.zoom.us/v2/users/${email}/meetings`;
  const header = {
    "User-Agent": "Zoom-api-Jwt-Request",
    "content-type": "application/json",
    auth: {
      bearer: token
    }
  };
  const body = {
    topic: "Client Meeting", // meeting title
    type: 1,
    settings: {
      host_video: "true",
      participant_video: "true"
    }
  };
  const response = await axios.post(uri, body, { header });
  console.log(response);
  return response.data;
};
