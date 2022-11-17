const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const OrderController = require("../controllers/OrderController");

const { validate, orderValidation } = require("../helpers/validators");

router.route("/orders/my-orders").get(Auth, OrderController.getMyOrders);

router
  .route("/orders/submit-order")
  .post(orderValidation(), validate, Auth, OrderController.createOrder);

router
  .route("/orders/order-request")
  .get(Auth, OrderController.getOrderRequest);

module.exports = router;
