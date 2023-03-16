const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const OrderController = require("../controllers/OrderController");

const {
  validate,
  orderValidation,
  updateOrderValidation,
  updateOrderRequestValidation
} = require("../helpers/validators");

router.route("/orders/my-orders").get([Auth, Access.verifyAccess], OrderController.getMyOrders);

router
  .route("/orders/order-detail/:orderId")
  .get([Auth, Access.verifyAccess], OrderController.getOrderDetails);

router
  .route("/orders/submit-order")
  .post(orderValidation(), validate, [Auth, Access.verifyAccess], OrderController.createOrder);

router
  .route("/orders/update-order")
  .patch(updateOrderValidation(), validate, [Auth, Access.verifyAccess], OrderController.updateOrder);

router
  .route("/orders/request/update-order")
  .patch(
    updateOrderRequestValidation(),
    validate,
    [Auth, Access.verifyAccess],
    OrderController.updateOrderRequest
  );

router
  .route("/orders/order-request")
  .get([Auth, Access.verifyAccess], OrderController.getOrderRequest);

router.route("/orders/all").get([Auth, Access.verifyAccess], OrderController.getAllOrders);

// Router
router
  .route("/orders/generateInvoice")
  .get([Auth, Access.verifyAccess], OrderController.generateOrderInvoice);

module.exports = router;
