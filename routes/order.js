const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const OrderController = require("../controllers/OrderController");

const {
  validate,
  orderValidation,
  updateOrderValidation,
  updateOrderRequestValidation
} = require("../helpers/validators");

router.route("/orders/my-orders").get(Auth, OrderController.getMyOrders);

router
  .route("/orders/order-detail/:orderId")
  .get(Auth, OrderController.getOrderDetails);

router
  .route("/orders/submit-order")
  .post(orderValidation(), validate, Auth, OrderController.createOrder);

router
  .route("/orders/update-order")
  .patch(updateOrderValidation(), validate, Auth, OrderController.updateOrder);

router
  .route("/orders/request/update-order")
  .patch(
    updateOrderRequestValidation(),
    validate,
    Auth,
    OrderController.updateOrderRequest
  );

router
  .route("/orders/order-request")
  .get(Auth, OrderController.getOrderRequest);

router.route("/orders/all").get(Auth, OrderController.getAllOrders);

module.exports = router;
