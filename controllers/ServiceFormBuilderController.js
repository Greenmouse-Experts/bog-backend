/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const ServicesFormBuilder = require("../models/ServicesFormBuilder");
const ServiceType = require("../models/ServiceType");

const formatServiceForm = _serviceForms => {
  const __serviceForms = [];

  _serviceForms.forEach(_s => {
    if (__serviceForms.length === 0) {
      __serviceForms.push({
        formTitle: _s.serviceName,
        serviceType: _s.serviceType,
        fields: [
          {
            label: _s.label,
            inputType: _s.inputType,
            required: _s.required,
            formSubs: [
              {
                id: _s.id,
                placeholder: _s.placeholder,
                name: _s.name,
                value: _s.value,
                isActive: _s.isActive
              }
            ]
          }
        ]
      });
    } else if (
      __serviceForms.filter(_sform => _sform.formTitle === _s.serviceName && _sform.serviceType.id === _s.serviceTypeID)
        .length === 0
    ) {
      __serviceForms.push({
        formTitle: _s.serviceName,
        serviceType: _s.serviceType,
        fields: [
          {
            label: _s.label,
            inputType: _s.inputType,
            required: _s.required,
            formSubs: [
              {
                id: _s.id,
                placeholder: _s.placeholder,
                name: _s.name,
                value: _s.value,
                isActive: _s.isActive
              }
            ]
          }
        ]
      });
    } else {
      for (let index = 0; index < __serviceForms.length; index++) {
        const element = __serviceForms[index];

        if (element.formTitle === _s.serviceName && element.serviceType.id === _s.serviceTypeID) {
          if (
            element.fields.filter(_field => _field.label === _s.label)
              .length === 0
          ) {
            __serviceForms[index].fields.push({
              label: _s.label,
              inputType: _s.inputType,
              required: _s.required,
              formSubs: [
                {
                  id: _s.id,
                  placeholder: _s.placeholder,
                  name: _s.name,
                  value: _s.value,
                  isActive: _s.isActive
                }
              ]
            });
          } else {
            const retrivedLabelFormSubs = element.fields.filter(
              _field => _field.label === _s.label
            );
            let labelIndex = 0;

            // Get index of the label
            for (let index2 = 0; index2 < element.fields.length; index2++) {
              const element2 = element.fields[index2];
              if(element2.label === _s.label){
                break;
              }
              labelIndex += 1;
            }

            if (retrivedLabelFormSubs.length > 0) {
              const _valueFormSubs = retrivedLabelFormSubs[0].formSubs.filter(_retrieved => _retrieved.value === _s.value);
             
              if(_valueFormSubs.length === 0){
                __serviceForms[index].fields[labelIndex].formSubs.push({
                  id: _s.id,
                  placeholder: _s.placeholder,
                  name: _s.name,
                  value: _s.value,
                  isActive: _s.isActive
                })
              }
            }

          }
        }
      }
    }
  });

  return __serviceForms;
};

/**
 * Create a service form
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.createServiceForm = async (req, res, next) => {
  const form = req.body;
  const { serviceName, serviceTypeID, label, inputType, name, value } = req.body;
  try {
    // Check service type
    for (let index = 0; index < form.length; index++) {
      const { serviceName, serviceTypeID, label, inputType, name, value } = form[index];
      
      const serviceType = await ServiceType.findOne({id: serviceTypeID});
      if (serviceType === null) {
        return res.status(400).send({
          success: false,
          msg: "Service Type does not exist!"
        })
      }

      const ServiceDetail = await ServicesFormBuilder.findOne({
        where: { serviceTypeID, serviceName, label, inputType, name, value }
      });
      if (ServiceDetail !== null) {
        return res.status(400).send({
          success: false,
          message: "Form exists!"
        });
      }

      const response = await ServicesFormBuilder.create({
        ...req.body,
        isActive: true
      });

    }
    
    return res.status(201).send({
      success: true,
      message: "Form created!",
      data: response
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all services forms
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getServiceForms = async (req, res, next) => {
  try {
    const serviceForms = await ServicesFormBuilder.findAll({include: [{
      model: ServiceType, as: "serviceType"
    }]});

    return res.status(200).send({
      success: true,
      data: formatServiceForm(serviceForms)
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get service form details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getServiceFormDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const serviceForm = await ServicesFormBuilder.findOne({
      where: { id },
      include: [{
        model: ServiceType, as: "serviceType"
      }],
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).send({
      success: true,
      data: serviceForm === null ? {} : serviceForm
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a service form
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.updateServiceForm = async (req, res, next) => {
  const { id } = req.params;
  try {
    const serviceForm = await ServicesFormBuilder.findOne({
      where: { id },
      order: [["createdAt", "DESC"]]
    });
    if (serviceForm === null) {
      return res.status(404).send({
        status: false,
        message: "Service form not found"
      });
    }

    const response = await ServicesFormBuilder.update(req.body, {
      where: { id }
    });

    return res.status(200).send({
      success: true,
      message: "Service form updated!"
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete a service form
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.deleteServiceForm = async (req, res, next) => {
  const { id } = req.params;
  try {
    const serviceForm = await ServicesFormBuilder.findOne({
      where: { id }
    });
    if (serviceForm === null) {
      return res.status(400).send({
        status: false,
        message: "Service form not found"
      });
    }

    const response = await ServicesFormBuilder.destroy({ where: { id } });
    return res.send({
      success: true,
      message: "Service form deleted!"
    });
  } catch (error) {
    return next(error);
  }
};
// exports.getServiceProviderDetails = async id => {
//   const serviceProvider = await ServiceType.findOne({
//     where: { id },
//     include: [
//       {
//         model: Services,
//         as: "service"
//       }
//     ]
//   });
//   return serviceProvider;
// };

// exports.findServiceType = async (req, res, next) => {
//   try {
//     const types = await this.getServiceProviderDetails(req.params.typeId);
//     return res.status(200).send({
//       success: true,
//       data: types
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.updateServiceType = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { typeId, ...update } = req.body;
//       const getTheType = await ServiceType.findOne({
//         where: { id: typeId }
//       });
//       if (!getTheType) {
//         return res.status(404).send({
//           success: false,
//           message: "Invalid category"
//         });
//       }
//       await ServiceType.update(update, {
//         where: { id: typeId },
//         transaction: t
//       });
//       return res.status(200).send({
//         success: true,
//         data: getTheType
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };

// exports.deleteCategory = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { typeId } = req.params;
//       const getTheType = await ServiceType.findOne({
//         where: { id: typeId }
//       });
//       if (!getTheType) {
//         return res.status(404).send({
//           success: false,
//           message: "Invalid category"
//         });
//       }
//       await ServiceType.destroy({ where: { id: typeId }, transaction: t });
//       return res.status(200).send({
//         success: true,
//         message: "Service type deleted successfully"
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };

// // BOG Services

// exports.createService = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const type = await Services.create(req.body, {
//         transaction: t
//       });
//       return res.status(200).send({
//         success: true,
//         data: type
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };

// exports.getServices = async (req, res, next) => {
//   try {
//     const types = await Services.findAll({ order: [["createdAt", "DESC"]] });
//     return res.status(200).send({
//       success: true,
//       data: types
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.findSingleService = async (req, res, next) => {
//   try {
//     const types = await Services.findOne({
//       where: { id: req.params.typeId }
//     });
//     return res.status(200).send({
//       success: true,
//       data: types
//     });
//   } catch (error) {
//     return next(error);
//   }
// };

// exports.updateService = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { name } = req.body;
//       const { id } = req.params;
//       const getTheType = await Services.findOne({
//         where: { id }
//       });
//       if (!getTheType) {
//         return res.status(404).send({
//           success: false,
//           message: "Invalid service"
//         });
//       }
//       await Services.update(
//         { name },
//         {
//           where: { id },
//           transaction: t
//         }
//       );
//       return res.status(200).send({
//         success: true,
//         message: "Service updated"
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };

// exports.deleteServices = async (req, res, next) => {
//   sequelize.transaction(async t => {
//     try {
//       const { id } = req.params;
//       const getTheType = await Services.findOne({
//         where: { id }
//       });
//       if (!getTheType) {
//         return res.status(404).send({
//           success: false,
//           message: "Invalid Services"
//         });
//       }
//       await Services.destroy({ where: { id }, transaction: t });
//       return res.status(200).send({
//         success: true,
//         message: "Service deleted successfully"
//       });
//     } catch (error) {
//       t.rollback();
//       return next(error);
//     }
//   });
// };
