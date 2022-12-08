require("dotenv").config();

module.exports = {
  header: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
  }
};
