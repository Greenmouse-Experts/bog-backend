require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.zoomGenerator = async (email, title) => {
  try {
    
    const payload = {
      iss: process.env.ZOOM_API_KEY, // your API KEY
      exp: new Date().getTime() + 5000
    };
    const token = jwt.sign(payload, process.env.ZOOM_API_SECRET); // your API SECRET HERE
    console.log(token)
    const uri = `https://api.zoom.us/v2/users/${email}/meetings`;
    const config = {
      headers: {
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    const body = {
      topic: title, // meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true"
      }
    };
    const response = await axios.post(uri, body, config);
    // const response = await axios.get(uri, config);
    return response.data;
  } catch (error) {
    console.log(error.response)
  }
};
