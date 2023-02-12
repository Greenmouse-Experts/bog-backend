const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const Access = require("../middleware/access");

const ServiceFormBuilderController = require("../controllers/ServiceFormBuilderController");
const { validate, ServiceFormBuilderValidation } = require("../helpers/validators");

router
  .route("/service/form-builder/create")
  .post(
    // ServiceFormBuilderValidation(), validate,
    [Auth, Access.verifyAccess],
    ServiceFormBuilderController.createServiceForm
  );

router
  .route("/service/form-builder/all")
  .get(
    [Auth, Access.verifyAccess],
    ServiceFormBuilderController.getServiceForms
  );


router
  .route("/service/form-builder/:typeID")
  .get(
    [Auth, Access.verifyAccess],
    ServiceFormBuilderController.getServiceFormDetails
  )
  .put(
    [Auth, Access.verifyAccess],
    ServiceFormBuilderController.updateServiceForm
  )
  .delete(
    [Auth, Access.verifyAccess],
    ServiceFormBuilderController.deleteServiceForm
  );
  
// router
//   .route("/service/type/update")
//   .patch(validate, [Auth, Access.verifyAccess], ServiceController.updateServiceType);

// router.route("/service/type").get(ServiceController.getServiceTypes);

// router.route("/service/type/:typeId").get(ServiceController.findServiceType);

// router
//   .route("/service/type/delete/:typeId")
//   .delete(validate, [Auth, Access.verifyAccess], ServiceController.deleteCategory);

// // BOG Services
// router.route("/services/create").post([Auth, Access.verifyAccess], ServiceController.createService);

// router
//   .route("/services/update/:id")
//   .patch([Auth, Access.verifyAccess], ServiceController.updateService);

// router.route("/services/delete/:id").delete(ServiceController.deleteServices);

// router.route("/services/all").get(ServiceController.getServices);

module.exports = router;
