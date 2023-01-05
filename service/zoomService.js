require("dotenv").config();
const requestPromise = require("request-promise");
const jwt = require("jsonwebtoken");

exports.zoomGenerator = async email => {
  const payload = {
    iss: process.env.ZOOM_API_KEY, // your API KEY
    exp: new Date().getTime() + 5000
  };
  const token = jwt.sign(payload, process.env.ZOOM_API_SECRET); // your API SECRET HERE
  const options = {
    method: "POST",
    uri: `https://api.zoom.us/v2/users/${email}/meetings`,
    body: {
      topic: "Client Meeting", // meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true"
      }
    },
    auth: {
      bearer: token
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json"
    },
    json: true // Parse the JSON string in the response
  };
  const result = await requestPromise(options)
    .then(response => {
      return response;
    })
    .catch(() => {
      return false;
    });
  return result;
};
