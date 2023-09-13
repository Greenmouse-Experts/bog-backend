require("dotenv").config();
const nodemailer = require("nodemailer");

const email_data = {
  // APP_NAME: "BOG",
  // EMAIL_PASSWORD: "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",
  // EMAIL_USERNAME: "apikey",
  // EMAIL_HOST: "smtp.sendgrid.net",
  // EMAIL_PORT: 465,
  // EMAIL_FROM: "buildonthego2023@gmail.com",
  // EMAIL_SECURE: true
  APP_NAME: "BOG",
  EMAIL_PASSWORD: "VK!x_6%vo___",
  EMAIL_USERNAME: "no-reply@buildonthego.com",
  EMAIL_HOST: "mail.buildonthego.com",
  EMAIL_PORT: 587,
  EMAIL_FROM: "no-reply@buildonthego.com",
  EMAIL_SECURE: false,
  // EMAIL_PASSWORD: "Ca2Y5tf1;D^v",
  // EMAIL_USERNAME: "no-reply@buildonthego.com",
  // EMAIL_HOST: "mail.buildonthego.com",
  // EMAIL_PORT: 587,
  // EMAIL_FROM: "no-reply@buildonthego.com",
  // EMAIL_SECURE: true,
};

const transporter = nodemailer.createTransport({
  host: email_data.EMAIL_HOST,
  port: email_data.EMAIL_PORT,
  secure: email_data.EMAIL_SECURE || false, // true for 465, false for other ports
  auth: {
    user: email_data.EMAIL_USERNAME, // generated ethereal user
    pass: email_data.EMAIL_PASSWORD, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendMail = async (email, message, subject, files = []) => {
  // console.log(files);
  try {
    // send mail with defined transport object
    const mailOptions = {
      from: email_data.EMAIL_FROM, // sender address
      to: `${email}`, // list of receivers
      subject, // Subject line
      text: "BOG LTD", // plain text body
      html: message, // html body
      attachments: files
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log(err, "Error Sending mail");
      } else {
        console.log(info, "Email Sent succesfully");
      }
    });
  } catch (error) {
    console.error(error);
  }
};
