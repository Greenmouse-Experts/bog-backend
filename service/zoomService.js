require("dotenv").config();
const axios = require("axios");
const btoa = require("btoa");
const jwt = require("jsonwebtoken");

exports.zoomGenerator = async (email, title) => {
  try {
    
    const init_url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

    
    const init_response = await axios.post(init_url, {}, {
      headers: {
        'Authorization': `Basic ${btoa(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`)}`
      }
    });

    if(!Boolean(init_response.data.access_token)){
      throw new Error('Token generation failed.')
    }

    // Create meeting
    const meeting_url = 'https://api.zoom.us/v2/users/me/meetings'
    const body = {
      topic: title, // meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true"
      }
    };
    const meeting_response = await axios.post(meeting_url, body, {
      headers: {
        Authorization: `Bearer ${init_response.data.access_token}`
      }
    })

    console.log(meeting_response)

    return meeting_response.data;
  } catch (error) {
    console.log(error)
  }
};
