const express = require("express");


const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const DeliveryAddressController = require("../controllers/DeliveryAddressController");

const { validate, addressValidation } = require("../helpers/validators");

router
  .route("/address/create")
  .post(
    [Auth, Access.verifyAccess, Access.verifyAdmin],
    addressValidation(), validate,
    DeliveryAddressController.createAddress
  );

router
  .route("/address/view/all") //?q={state}
  .get([Auth, Access.verifyAccess], DeliveryAddressController.viewAddresses);

router
  .route("/address/view/:id")
  .get([Auth, Access.verifyAccess], DeliveryAddressController.viewAddress);

router
  .route("/address/:id")
  .put([Auth, Access.verifyAccess, Access.verifyAdmin], DeliveryAddressController.updateAddress)
  .delete([Auth, Access.verifyAccess, Access.verifyAdmin], DeliveryAddressController.deleteAddress)


module.exports = router;
