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
  .route("/orders/delivery/list")
  .get([Auth, Access.verifyAccess], OrderController.getDeliveryAddresses);

router
  .route("/orders/delivery/remove/:deliveryId")
  .delete([Auth, Access.verifyAccess], OrderController.removeDeliveryAddress);

router
  .route("/orders/delivery/update/:deliveryId")
  .patch([Auth, Access.verifyAccess], OrderController.updateDeliveryAddress);

router
  .route("/orders/update-order")
  .patch(updateOrderValidation(), validate, [Auth, Access.verifyAccess, Access.verifyAdmin], OrderController.updateOrder);
  
  router
  .route("/orders/cancel-order/:orderId")
  .get([Auth, Access.verifyAccess, Access.verifyUser], OrderController.cancelOrder);
  
  router
    .route("/orders/request-refund/:orderId")
    .get([Auth, Access.verifyAccess, Access.verifyUser], OrderController.requestRefund);
  
    
  router
    .route("/orders/refund/:orderId")
    .get([Auth, Access.verifyAccess, Access.verifyAdmin], OrderController.refundOrder);
  
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
