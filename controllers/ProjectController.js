/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
require("dotenv").config();
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
const sequelize = require("../config/database/connection");
const User = require("../models/User");
const Project = require("../models/Project");
const ServiceFormProjects = require("../models/ServiceFormProjects");

const LandSurveyProject = require("../models/LandSurveyProject");
const DrawingProject = require("../models/DrawingProject");
const BuildingProject = require("../models/BuildingProject");
const ContractorProject = require("../models/ContractorProject");
const GeoTechnical = require("../models/GeoTechnical");
const utility = require("../helpers/utility");
const Notification = require("../helpers/notification");
const userService = require("../service/UserService");
const ServiceType = require("../models/ServiceType");
const ServicePartner = require("../models/ServicePartner");
const ServiceProvider = require("../models/ServiceProvider");
const ProjectBidding = require("../models/ProjectBidding");
const ServicesFormBuilders = require("../models/ServicesFormBuilder");
const PrivateClient = require("../models/PrivateClient");
const CorporateClient = require("../models/CorporateClient");

exports.notifyAdmin = async ({ userId, message, req }) => {
  const notifyType = "admin";
  const { io } = req.app;
  await Notification.createNotification({
    type: notifyType,
    message,
    userId,
  });
  io.emit("getNotifications", await Notification.fetchAdminNotification());
};

// Projects
exports.getProjectRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await userService.getUserTypeProfile(
      req.query.userType,
      userId
    );
    const where = { userId: profile.id };
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );
    const data = await Promise.all(
      projects.map(async (project) => {
        const requestData = await this.getProjectTypeData(
          project.id,
          project.projectTypes
        );
        project.projectData = requestData;
        return project;
      })
    );
    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// Projects Service Partner
exports.getServicePartnerProjectRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await userService.getUserTypeProfile(
      req.query.userType,
      userId
    );
    const where = { serviceProviderId: profile.id };
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );
    const data = await Promise.all(
      projects.map(async (project) => {
        const requestData = await this.getProjectTypeData(
          project.id,
          project.projectTypes
        );
        project.projectData = requestData;
        return project;
      })
    );
    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllProjectRequest = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );
    const data = await Promise.all(
      projects.map(async (project) => {
        const requestData = await this.getProjectTypeData(
          project.id,
          project.projectTypes
        );
        let projectOwner = await PrivateClient.findByPk(project.userId, {
          include: ["private_user"],
        });
        if (!projectOwner) {
          projectOwner = await CorporateClient.findByPk(project.userId, {
            include: ["corporate_user"],
          });
        }
        project.projectOwner = projectOwner;
        if (project.status === "ongoing") {
          const serviceProvider = await ServicePartner.findByPk(
            project.serviceProviderId,
            { include: ["service_user"] }
          );
          project.serviceProvider = serviceProvider;
        }
        project.projectData = requestData;
        return project;
      })
    );
    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * View all project requests v2
 */
exports.getAllProjectRequestV2 = async (req, res, next) => {
  try {
    const where = null;
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = await Project.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    // const data = await Promise.all(
    //   projects.map(async project => {
    //     const requestData = await ServiceFormProjects.findAll({
    //       include: [{model: ServicesFormBuilders, as: 'serviceForm'}],
    //       where: {projectID: project.id}
    //     });

    //     const proj = {
    //       ...project.toJSON(),
    //       projectData: requestData
    //     }
    //     // project.toJSON().projectData = requestData;
    //     return proj;
    //   })
    // );
    return res.status(200).send({
      success: true,
      data: projects,
    });
  } catch (error) {
    return next(error);
  }
};

exports.viewProjectRequest = async (req, res, next) => {
  try {
    const where = { id: req.params.projectId };
    const project = JSON.parse(
      JSON.stringify(
        await Project.findOne({
          where,
        })
      )
    );
    const result = await this.getFullProjectRequest(project);

    return res.status(200).send({
      success: true,
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * v2 view project request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.viewProjectRequestV2 = async (req, res, next) => {
  try {
    const where = { id: req.params.projectId };
    const project = await Project.findOne({
      where,
    });

    if (project === null) {
      return res.status(404).send({
        status: false,
        message: "Project not found!",
      });
    }

    const requestData = await ServiceFormProjects.findAll({
      include: [{ model: ServicesFormBuilders, as: "serviceForm" }],
      where: { projectID: project.id },
    });

    // project.toJSON().projectData = requestData;

    return res.status(200).send({
      success: true,
      data: {
        ...project.toJSON(),
        projectData: requestData,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user's project based on the specified status in req.query.status
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.userProjects = async (req, res, next) => {
  try {
    const {status} = req.query;
    const {id} = req.params;
    const where = {};
    if (status === undefined) {
      where = {id}
    } else {
      where = {id, status}
    }
    const project = await Project.findOne({
      where
    });

    if (project === null) {
      return res.status(404).send({
        status: false,
        message: "Project not found!",
      });
    }

    const requestData = await ServiceFormProjects.findAll({
      include: [{ model: ServicesFormBuilders, as: "serviceForm" }],
      where: { projectID: project.id },
    });

    // project.toJSON().projectData = requestData;

    return res.status(200).send({
      success: true,
      data: {
        ...project.toJSON(),
        projectData: requestData,
      },
    });
  } catch (error) {
    return next(error);
  }
}

exports.createProject = async (data, transaction) => {
  try {
    const type = utility.projectSlug(data.projectTypes);
    const projectSlug = `BOG/PRJ/${type}/${Math.floor(
      190000000 + Math.random() * 990000000
    )}`;
    data.projectSlug = projectSlug;
    data.status = "pending";
    const result = await Project.create(data);

    return result;
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return error;
  }
};

exports.deleteProjectRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { requestId } = req.params;
      const project = await Project.findOne({
        where: { id: requestId },
      });
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project Request",
        });
      }
      await Project.destroy({
        where: { id: requestId },
        transaction: t,
      });
      await this.deleteProjectTypeData(requestId, project.projectTypes, t);
      return res.status(200).send({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.getProjectTypeData = async (projectId, type) => {
  let data = null;
  switch (type) {
    case "land_survey":
      data = await LandSurveyProject.findOne({ where: { projectId } });
      return data;
    case "construction_drawing":
      data = await DrawingProject.findOne({ where: { projectId } });
      return data;
    case "building_approval":
      data = await BuildingProject.findOne({ where: { projectId } });
      return data;
    case "contractor":
      data = await ContractorProject.findOne({ where: { projectId } });
      return data;
    case "geotechnical_investigation":
      data = await GeoTechnical.findOne({ where: { projectId } });
      return data;
    default:
      return data;
  }
};

exports.deleteProjectTypeData = async (projectId, type, t) => {
  switch (type) {
    case "land_survey":
      await LandSurveyProject.destroy({ where: { projectId }, transaction: t });
      return true;
    case "construction_drawing":
      await DrawingProject.destroy({ where: { projectId }, transaction: t });
      return true;
    case "building_approval":
      await BuildingProject.destroy({ where: { projectId }, transaction: t });
      return true;
    case "contractor":
      await ContractorProject.destroy({ where: { projectId }, transaction: t });
      return true;
    case "geotechnical_investigation":
      await GeoTechnical.destroy({ where: { projectId }, transaction: t });
      return true;
    default:
      return true;
  }
};

/**
 * Request for a type of service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.requestForService = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const user = await User.findOne({ where: { id: userId } });

      const { form } = req.body;

      let _project = null;
      const serviceRequestForm = [];
      let serviceNameRes = "";
      for (let index = 0; index < form.length; index++) {
        const f = form[index];

        // Get Service form
        const serviceForm = await ServicesFormBuilders.findOne({
          include: [{ model: ServiceType, as: "serviceType" }],
          where: { id: f._id },
        });

        if (serviceForm === null) {
          return res.status(400).send({
            status: false,
            msg: "This service form input does not exist!",
          });
        }

        const request = {
          serviceFormID: serviceForm.id,
          value: f.value,
          userID: userId,
          status: "pending",
        };

        serviceRequestForm.push(request);
      }

      for (let index = 0; index < serviceRequestForm.length; index++) {
        const s = serviceRequestForm[index];

        // Get Service form
        const serviceForm = await ServicesFormBuilders.findOne({
          include: [{ model: ServiceType, as: "serviceType" }],
          where: { id: s.serviceFormID },
        });

        const profile = await userService.getUserTypeProfile(
          user.userType,
          userId
        );

        const projectData = {
          title: serviceForm.serviceName,
          userId: profile.id,
          projectTypes: serviceForm.serviceType.slug,
        };

        if (_project === null) {
          _project = await this.createProject(projectData, t);
          // console.log(_project)
          serviceNameRes = `${user.name} has opened a project request for ${serviceForm.serviceType.title}`;
          const reqData = {
            req,
            userId,
            message: `${user.name} has opened a project request for ${serviceForm.serviceType.title}`,
          };
          await this.notifyAdmin(reqData);
        }

        const request = {
          serviceFormID: serviceForm.id,
          value: s.value,
          userID: s.userID,
          projectID: _project.id,
          status: "pending",
        };

        const data = await ServiceFormProjects.create(request);
      }

      return res.status(200).send({
        success: true,
        message: "Project requested",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Land Survey Request
exports.requestForLandSurvey = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const { userType } = req.body;
      const request = req.body;
      const profile = await userService.getUserTypeProfile(userType, userId);
      const projectData = {
        title: req.body.title,
        userId: profile.id,
        projectTypes: "land_survey",
      };
      const project = await this.createProject(projectData, t);
      request.userId = userId;
      request.projectId = project.id;
      const data = await LandSurveyProject.create(request, {
        transaction: t,
      });
      const reqData = {
        req,
        userId,
        message: `${user.name} has open a project request for Land survey`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateLandSurveyRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const request = req.body;
      const { requestId, title } = req.body;
      const survey = await LandSurveyProject.findOne({
        where: { id: requestId },
      });
      if (!survey) {
        return res.status(404).send({
          success: false,
          message: "Invalid Land Survey",
        });
      }
      if (title && title !== "") {
        await Project.update(
          { title },
          { where: { id: survey.projectId }, transaction: t }
        );
      }

      await LandSurveyProject.update(request, {
        where: { id: requestId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Land Survey request updated successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Contractor Projects
exports.requestForContractor = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const {
        title,
        projectLocation,
        clientName,
        projectType,
        buildingType,
        userType,
      } = req.body;
      const profile = await userService.getUserTypeProfile(userType, userId);
      const projectData = {
        title,
        userId: profile.id,
        projectTypes: "contractor",
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        projectType,
        buildingType,
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.surveyPlan = url;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.structuralPlan = url;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.architecturalPlan = url;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.mechanicalPlan = url;
          }
        }
      }

      const data = await ContractorProject.create(request, {
        transaction: t,
      });
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const reqData = {
        req,
        userId,
        message: `${user.name} has requested for a contractor service partner`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateContractorRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        projectLocation,
        clientName,
        projectType,
        buildingType,
        requestId,
        title,
      } = req.body;

      const project = await ContractorProject.findOne({
        where: { id: requestId },
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project",
        });
      }

      if (title && title !== "") {
        await Project.update(
          { title },
          { where: { id: project.projectId }, transaction: t }
        );
      }

      const request = {
        projectLocation,
        clientName,
        projectType,
        buildingType,
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.surveyPlan = url;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.structuralPlan = url;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.architecturalPlan = url;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.mechanicalPlan = url;
          }
        }
      }
      await ContractorProject.update(request, {
        where: { id: requestId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Contractor request updated successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Drawing Projects
exports.drawingProjectsRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const {
        title,
        projectLocation,
        clientName,
        projectType,
        buildingType,
        drawingType,
        userType,
      } = req.body;
      const profile = await userService.getUserTypeProfile(userType, userId);
      const projectData = {
        title,
        userId: profile.id,
        projectTypes: "construction_drawing",
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        projectType,
        buildingType,
        drawingType,
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.surveyPlan = url;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.structuralPlan = url;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.architecturalPlan = url;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.mechanicalPlan = url;
          }
          if (req.files[i].fieldname === "electricalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.electricalPlan = url;
          }
        }
      }

      const data = await DrawingProject.create(request, {
        transaction: t,
      });
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const reqData = {
        req,
        userId,
        message: `${user.name} has open a request for a construction drawing project`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        message: "Drawing Project created successfully",
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateDrawingRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        projectLocation,
        clientName,
        projectType,
        buildingType,
        requestId,
        title,
        drawingType,
      } = req.body;

      const project = await DrawingProject.findOne({
        where: { id: requestId },
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project",
        });
      }

      if (title && title !== "") {
        await Project.update(
          { title },
          { where: { id: project.projectId }, transaction: t }
        );
      }

      const request = {
        projectLocation,
        clientName,
        projectType,
        buildingType,
        drawingType,
      };

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.surveyPlan = url;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.structuralPlan = url;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.architecturalPlan = url;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.mechanicalPlan = url;
          }
          if (req.files[i].fieldname === "electricalPlan") {
            const url = `${process.env.APP_URL}/${req.files[i].path}`;
            request.electricalPlan = url;
          }
        }
      }
      await DrawingProject.update(request, {
        where: { id: requestId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Drawing request updated successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Building Approval Projects
exports.buildingApprovalProjectsRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const {
        title,
        projectLocation,
        clientName,
        purpose,
        userType,
      } = req.body;
      const profile = await userService.getUserTypeProfile(userType, userId);
      const projectData = {
        title,
        userId: profile.id,
        projectTypes: "building_approval",
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        purpose,
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const url = `${process.env.APP_URL}/${req.files[i].path}`;
          const name = req.files[i].fieldname;
          request[name] = url;
        }
      }

      const data = await BuildingProject.create(request, {
        transaction: t,
      });
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const reqData = {
        req,
        userId,
        message: `${user.name} has requested for a building approval project`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        message: "Building Approval Project created successfully",
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateBuildingApprovalRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        projectLocation,
        clientName,
        purpose,
        requestId,
        title,
      } = req.body;

      const project = await BuildingProject.findOne({
        where: { id: requestId },
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project",
        });
      }

      if (title && title !== "") {
        await Project.update(
          { title },
          { where: { id: project.projectId }, transaction: t }
        );
      }

      const request = {
        projectLocation,
        clientName,
        purpose,
      };

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const url = `${process.env.APP_URL}/${req.files[i].path}`;
          const name = req.files[i].fieldname;
          request[name] = url;
        }
      }

      await BuildingProject.update(request, {
        where: { id: requestId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Building request updated successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Geotechnical Request
exports.requestForGeoTechnicalInvestigation = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const userId = req.user.id;
      const request = req.body;
      const { userType, title } = req.body;
      const profile = await userService.getUserTypeProfile(userType, userId);
      const projectData = {
        title,
        userId: profile.id,
        projectTypes: "geotechnical_investigation",
      };
      const project = await this.createProject(projectData, t);
      request.userId = userId;
      request.projectId = project.id;
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const url = `${process.env.APP_URL}/${req.files[i].path}`;
          const name = req.files[i].fieldname;
          request[name] = url;
        }
      }
      const data = await GeoTechnical.create(request, {
        transaction: t,
      });
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const reqData = {
        req,
        userId,
        message: `${user.name} has requested for a geotechnical investigator`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateGeoTechnicalInvestigationRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const request = req.body;
      const { requestId, title } = req.body;
      const survey = await GeoTechnical.findOne({
        where: { id: requestId },
      });
      if (!survey) {
        return res.status(404).send({
          success: false,
          message: "Invalid Investigation",
        });
      }
      if (title && title !== "") {
        await Project.update(
          { title },
          { where: { id: survey.projectId }, transaction: t }
        );
      }
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const url = `${process.env.APP_URL}/${req.files[i].path}`;
          const name = req.files[i].fieldname;
          request[name] = url;
        }
      }

      await GeoTechnical.update(request, {
        where: { id: requestId },
        transaction: t,
      });
      return res.status(200).send({
        success: true,
        message: "Geotechnical Investigation updated successfully",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Request for project approval
exports.requestProjectApproval = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findOne({ where: { id: projectId } });
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project",
        });
      }
      const requestData = {
        approvalStatus: "in_review",
      };
      await Project.update(requestData, {
        where: { id: projectId },
        transaction: t,
      });
      const userId = req.user.id;
      const user = await User.findByPk(userId, { attributes: ["name"] });
      const reqData = {
        req,
        userId,
        message: `${user.name} has requested to commence with ${project.projectSlug}`,
      };
      await this.notifyAdmin(reqData);
      return res.status(200).send({
        success: true,
        message: "Project sent for approval",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Approve Project request
exports.approveProjectRequest = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { projectId } = req.params;
      const { isApproved } = req.body;
      const project = await Project.findOne({ where: { id: projectId } });
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project",
        });
      }
      const requestData = {
        approvalStatus: isApproved ? "approved" : "disapproved",
        status: isApproved ? "approved" : "closed",
      };
      await Project.update(requestData, {
        where: { id: projectId },
        transaction: t,
      });

      const { userId } = project;
      const message = `Your project ${project.projectSlug} has been ${
        isApproved ? "approved" : "disapproved"
      }  to commence. ${isApproved &&
        "Please wait for further information regarding cost and estimations"}`;

      const { io } = req.app;
      await Notification.createNotification({
        type: "user",
        message,
        userId,
      });
      io.emit(
        "getNotifications",
        await Notification.fetchUserNotificationApi({ userId })
      );
      return res.status(200).send({
        success: true,
        message: "Project approved for commencement",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Dispatch Project request
exports.dispatchProject = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { projectId } = req.params;
      const { score } = req.body;

      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project",
        });
      }
      const {
        providerData: serviceProviders,
        completed,
      } = await this.getQualifiedServiceProviders(project, score, t);
      console.log(completed);
      if (completed === true) {
        project.update({ status: "dispatched" }, { transaction: t });
        if (serviceProviders.length > 0) {
          await Promise.all(
            serviceProviders.map(async (service) => {
              await this.notifyServicePartner(req, serviceProviders.userId);
            })
          );
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Not enough service providers to dispatch job",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Project dispatched to service partner",
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getQualifiedServiceProviders = async (project, score, transaction) => {
  try {
    // check project type
    const { projectTypes, title } = project;
    // console.log(project)
    // get service types for project types
    const serviceTypes = await ServiceType.findOne({
      where: { slug: projectTypes, title },
    });
    // query all service partners with service type id
    // kyc point greater than the passed score
    // user is verified
    // user has active subscription
    const wherePartner = {
      serviceTypeId: serviceTypes.id,
      kycPoint: {
        [Op.gte]: score,
      },
      hasActiveSubscription: true,
      isVerified: true,
    };
    const servicePartners = JSON.parse(
      JSON.stringify(
        await ServicePartner.findAll({
          where: wherePartner,
          order: [[Sequelize.literal("RAND()")]],
        })
      )
    );
    console.log({ servicePartners });
    if (servicePartners.length === 0) {
      return {
        completed: false,
        message: "Not enough service providers",
        providerData: [],
      };
    }
    // remove service partners with ongoing projects
    const where = {
      status: "ongoing",
      approvalStatus: "approved",
      serviceProviderId: {
        [Op.ne]: null,
      },
    };
    const ongoingProjects = await Project.findAll({
      where,
      attributes: ["serviceProviderId"],
    });
    const partnersWithProjects = ongoingProjects.map(
      (p) => p.serviceProviderId
    );
    const filteredServicePartners = servicePartners.filter((partner) => {
      if (!partnersWithProjects.includes(partner.id)) {
        return partner;
      }
      return null;
    });
    const qualifiedPartners = filteredServicePartners.filter(
      (pat) => pat !== null
    );
    let providers = [...qualifiedPartners];
    if (qualifiedPartners.length > 3) {
      // get 3 random service partner for the project
      providers = this.getRandom(qualifiedPartners, 3);
    }
    // add them as service providers
    const providerData = providers.map((pr) => ({
      userId: pr.id,
      status: "pending",
      projectId: project.id,
    }));
    await ServiceProvider.bulkCreate(providerData, {
      transaction,
    });
    // send notifications to them
    return {
      completed: true,
      providerData,
    };
  } catch (error) {
    // console.log(error);
    transaction.rollback();
    return error;
  }
};

exports.getRandom = (arr, n) => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

exports.notifyServicePartner = async (req, userId) => {
  const message = `Admin has sent a project, see if you are interested in taking it up`;

  const { io } = req.app;
  await Notification.createNotification({
    type: "user",
    message,
    userId,
  });
  io.emit(
    "getNotifications",
    await Notification.fetchUserNotificationApi({ userId })
  );
  return true;
};

exports.getDispatchedProject = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const where = { userId };
    const requests = JSON.parse(
      JSON.stringify(
        await ServiceProvider.findAll({
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Project,
              as: "project",
            },
          ],
        })
      )
    );
   
    
    const data = await Promise.all(
      requests.filter(request => request.project !== null).map(async (request) => {
        
        if (request.project !== null) {
          const projectDetails = await ServiceFormProjects.findAll({
            where: { projectID: request.projectId },
          });
          // console.log(projectDetails)
          if (projectDetails !== null) {
            const bid = JSON.parse(
              JSON.stringify(
                await ProjectBidding.findOne({
                  where: {
                    userId,
                    projectId:
                      request.project === null ? "" : request.project.id,
                  },
                })
              )
            );
            request.hasBid = false;
            request.bid = null;
            if (bid) {
              request.hasBid = true;
              request.bid = bid;
            }
            request.projectDetails = projectDetails;
            return request;
          }
        }
      })
    );

    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAssignedProjects = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const where = { serviceProviderId: userId };
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]],
        })
      )
    );
    const data = await Promise.all(
      projects.map(async (project) => {
        const requestData = await ServiceFormProjects.findAll({where: {projectID: project.id}})
        
        project.projectData = requestData;
        return project;
      })
    );
    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// Assign Project to Service Partner
exports.assignProject = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const {
        projectId,
        userId,
        estimatedCost,
        totalCost,
        duration,
      } = req.body;
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project",
        });
      }
      const endDate = moment().add(duration, "weeks");
      const request = {
        serviceProviderId: userId,
        status: "ongoing",
        estimatedCost,
        totalCost,
        duration,
        endDate,
      };
      await project.update(request, { transaction: t });

      return res.status(200).send({
        success: true,
        message: "Project assigned to service partner",
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

// Assign Project to Service Partner
exports.bidForProject = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { userId, projectId } = req.body;
      const data = req.body;
      const project = await Project.findByPk(data.projectId);
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project",
        });
      }
      const where = {
        userId,
        projectId,
      };
      await ServiceProvider.update(
        { status: "accepted" },
        { where, transaction: t }
      );

      const bid = await ProjectBidding.create(data, { transaction: t });

      return res.status(200).send({
        success: true,
        message: "Project Bade successfully",
        data: bid,
      });
    } catch (error) {
      console.log(error);
      t.rollback();
      return next(error);
    }
  });
};

exports.getProjectBids = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);
    const bids = JSON.parse(
      JSON.stringify(await ProjectBidding.findAll({ where: { projectId } }))
    );
    const data = await Promise.all(
      bids.map(async (bid) => {
        const user = await userService.getUserFromProfile(
          "professional",
          bid.userId
        );
        bid.userDetails = user;
        const completedProjects = await Project.count({
          where: { serviceProviderId: bid.userId, status: "completed" },
        });
        const ongoingProjects = await Project.count({
          where: { serviceProviderId: bid.userId, status: "ongoing" },
        });
        bid.completedProjects = completedProjects;
        bid.ongoingProjects = ongoingProjects;
        return bid;
      })
    );
    return res.status(200).send({
      success: true,
      data: {
        project,
        bids: data,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getIndividualProjectBid = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findByPk(projectId);
    const bid = JSON.parse(
      JSON.stringify(
        await ProjectBidding.findOne({ where: { projectId, userId } })
      )
    );
    const user = await userService.getUserFromProfile("professional", userId);
    bid.userDetails = user;
    return res.status(200).send({
      success: true,
      data: {
        project,
        bid,
      },
    });
  } catch (error) {
    return next(error);
  }
};
