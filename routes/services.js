const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const ServiceController = require("../controllers/ServiceController");
const { validate, ServiceTypeValidation, ServiceValidation } = require("../helpers/validators");

router
  .route("/service/type/create")
  .post(
    ServiceTypeValidation(),
    validate,
    [Auth, Access.verifyAccess],
    ServiceController.CreateServiceType
  );
router
  .route("/service/type/update")
  .patch(validate, [Auth, Access.verifyAccess], ServiceController.updateServiceType);

router.route("/service/type").get(ServiceController.getServiceTypes);

router.route("/service/type/:typeId").get(ServiceController.findServiceType);

router
  .route("/service/type/delete/:typeId")
  .delete(validate, [Auth, Access.verifyAccess], ServiceController.deleteCategory);

// BOG Services
router.route("/services/create").post([Auth, Access.verifyAccess], ServiceValidation(), validate, ServiceController.createService);

router
  .route("/services/update/:id")
  .patch([Auth, Access.verifyAccess], ServiceController.updateService);

router.route("/services/delete/:id").delete(ServiceController.deleteServices);

router.route("/services/all").get(ServiceController.getServices);

module.exports = router;
