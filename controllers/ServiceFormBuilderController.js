/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const striptags = require("striptags");

const sequelize = require("../config/database/connection");
const ServicesFormBuilder = require("../models/ServicesFormBuilder");
const ServiceType = require("../models/ServiceType");

const formatServiceForm = (_serviceForms) => {
  const __serviceForms = [];

  _serviceForms.forEach((_s) => {
    if (__serviceForms.length === 0) {
      let __form = {};
      if (_s.subtype === null) {
        __form = {
          formTitle: _s.serviceName,
          serviceType: _s.serviceType,
          formData: [
            {
              label: _s.label,
              name: _s.name,
              inputType: _s.inputType,
              required: _s.required,
              placeholder: _s.placeholder,
              multiple: _s.multiple,
              requireValidOption: _s.requireValidOption,
              className: _s.className,
              placeholder: _s.placeholder,
              toggle: _s.toggle,
              subtype: _s.subtype,
              _values: [
                {
                  id: _s.id,
                  label: _s.subLabel,
                  selected: _s.selected,
                  value: _s.value,
                  isActive: _s.isActive,
                },
              ],
            },
          ],
        };
      } else {
        __form = {
          formTitle: _s.serviceName,
          serviceType: _s.serviceType,
          formData: [
            {
              id: _s.id,
              label: _s.label,
              name: _s.name,
              inputType: _s.inputType,
              required: _s.required,
              placeholder: _s.placeholder,
              multiple: _s.multiple,
              requireValidOption: _s.requireValidOption,
              className: _s.className,
              placeholder: _s.placeholder,
              toggle: _s.toggle,
              subtype: _s.subtype,
              _values: [],
            },
          ],
        };
      }
      __serviceForms.push(__form);
    } else if (
      __serviceForms.filter(
        (_sform) =>
          _sform.formTitle === _s.serviceName &&
          _sform.serviceType.id === _s.serviceTypeID
      ).length === 0
    ) {
      let __form = {};
      if (_s.subtype === null) {
        __form = {
          label: _s.label,
          name: _s.name,
          inputType: _s.inputType,
          required: _s.required,
          placeholder: _s.placeholder,
          multiple: _s.multiple,
          requireValidOption: _s.requireValidOption,
          className: _s.className,
          placeholder: _s.placeholder,
          toggle: _s.toggle,
          _values: [
            {
              id: _s.id,
              label: _s.subLabel,
              selected: _s.selected,
              value: _s.value,
              isActive: _s.isActive,
            },
          ],
        };
      } else {
        __form = {
          id: _s.id,
          label: _s.label,
          name: _s.name,
          inputType: _s.inputType,
          required: _s.required,
          placeholder: _s.placeholder,
          multiple: _s.multiple,
          requireValidOption: _s.requireValidOption,
          className: _s.className,
          placeholder: _s.placeholder,
          toggle: _s.toggle,
          subtype: _s.subtype,
          _values: [],
        };
      }

      __serviceForms.push({
        formTitle: _s.serviceName,
        serviceType: _s.serviceType,
        formData: [__form],
      });
    } else {
      for (let index = 0; index < __serviceForms.length; index++) {
        const element = __serviceForms[index];

        if (
          element.formTitle === _s.serviceName &&
          element.serviceType.id === _s.serviceTypeID
        ) {
          if (
            element.formData.filter((_field) => _field.name === _s.name)
              .length === 0
          ) {
            let __form = {};
            if (_s.subtype === null) {
              __form = {
                label: _s.label,
                name: _s.name,
                inputType: _s.inputType,
                required: _s.required,
                placeholder: _s.placeholder,
                multiple: _s.multiple,
                requireValidOption: _s.requireValidOption,
                className: _s.className,
                placeholder: _s.placeholder,
                toggle: _s.toggle,
                _values: [
                  {
                    id: _s.id,
                    label: _s.subLabel,
                    selected: _s.selected,
                    value: _s.value,
                    isActive: _s.isActive,
                  },
                ],
              };
            } else {
              __form = {
                id: _s.id,
                label: _s.label,
                name: _s.name,
                inputType: _s.inputType,
                required: _s.required,
                placeholder: _s.placeholder,
                multiple: _s.multiple,
                requireValidOption: _s.requireValidOption,
                className: _s.className,
                placeholder: _s.placeholder,
                toggle: _s.toggle,
                subtype: _s.subtype,
                _values: [],
              };
            }

            __serviceForms[index].formData.push(__form);
          } else {
            let __form = {};

            const retrivedLabelFormSubs = element.formData.filter(
              (_field) => _field.label === _s.label
            );
            let labelIndex = 0;

            // Get index of the label
            for (let index2 = 0; index2 < element.formData.length; index2++) {
              const element2 = element.formData[index2];
              if (element2.label === _s.label) {
                break;
              }
              labelIndex += 1;
            }

            if (retrivedLabelFormSubs.length > 0) {
              const _valueFormSubs = retrivedLabelFormSubs[0]._values.filter(
                (_retrieved) => _retrieved.value === _s.value
              );

              if (_valueFormSubs.length === 0) {
                if (_s.subtype === null) {
                  __serviceForms[index].formData[labelIndex]._values.push({
                    id: _s.id,
                    label: _s.subLabel,
                    selected: _s.selected,
                    value: _s.value,
                    isActive: _s.isActive,
                  });
                }
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
  const { serviceName, serviceType, formData } = req.body;
  try {
    // Check service type
    let form = JSON.parse(formData);
    if (typeof form === "string") {
      form = JSON.parse(formData);
    }
    for (let index = 0; index < form.length; index++) {
      const element = form[index];

      if (element.name === undefined) {
        element.name = `form-${String(Math.random()).split(".")[1]}`;
      }

      const _serviceType = await ServiceType.findOne({
        where: { id: serviceType },
      });
      if (_serviceType === null) {
        return res.status(400).send({
          success: false,
          message: "Service Type does not exist!",
        });
      }

      const ServiceDetail = await ServicesFormBuilder.findOne({
        where: { serviceTypeID: serviceType, serviceName, name: element.name },
      });
      if (ServiceDetail !== null) {
        return res.status(400).send({
          success: false,
          message: "Form exists!",
        });
      }

      element.label = striptags(element.label);
      let formParams = {
        ...element,
        serviceName: striptags(serviceName),
        serviceTypeID: striptags(serviceType),
        inputType: element.type,
      };

      if (element.values !== undefined) {
        for (let index2 = 0; index2 < element.values.length; index2++) {
          const element2 = element.values[index2];

          formParams.subLabel = striptags(element2.label);
          formParams.value = striptags(element2.value);
          formParams.selected = element2.selected;

          const response = await ServicesFormBuilder.create({
            ...formParams,
            isActive: true,
          });
        }
      } else {
        const response = await ServicesFormBuilder.create({
          ...formParams,
          isActive: true,
        });
      }
    }

    return res.status(201).send({
      success: true,
      message: "Form created!",
    });
  } catch (error) {
    console.log(error)
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
    const serviceForms = await ServicesFormBuilder.findAll({
      include: [
        {
          model: ServiceType,
          as: "serviceType",
        },
      ],
    });

    return res.status(200).send({
      success: true,
      data: formatServiceForm(serviceForms),
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
  const { typeID } = req.params;
  try {
    const serviceForm = await ServicesFormBuilder.findAll({
      where: { serviceTypeID: typeID },
      include: [
        {
          model: ServiceType,
          as: "serviceType",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).send({
      success: true,
      data: serviceForm.length === 0 ? {} : formatServiceForm(serviceForm)[0],
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
      order: [["createdAt", "DESC"]],
    });
    if (serviceForm === null) {
      return res.status(404).send({
        status: false,
        message: "Service form not found",
      });
    }

    const response = await ServicesFormBuilder.update(req.body, {
      where: { id },
    });

    return res.status(200).send({
      success: true,
      message: "Service form updated!",
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
  const { typeID } = req.params;
  try {
    const serviceForm = await ServicesFormBuilder.findAll({
      where: { serviceTypeID: typeID },
    });
    if (serviceForm.length === 0) {
      return res.status(400).send({
        status: false,
        message: "Service form not found",
      });
    }

    const response = await ServicesFormBuilder.destroy({
      where: { serviceTypeID: typeID },
    });
    return res.send({
      success: true,
      message: "Service form deleted!",
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
