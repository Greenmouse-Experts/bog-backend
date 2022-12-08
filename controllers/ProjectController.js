/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const User = require("../models/User");
const cloudinary = require("../helpers/cloudinary");
const Project = require("../models/Project");
const LandSurveyProject = require("../models/LandSurveyProject");
const DrawingProject = require("../models/DrawingProject");
const BuildingProject = require("../models/BuildingProject");
const ContractorProject = require("../models/ContractorProject");
const GeoTechnical = require("../models/GeoTechnical");
const utility = require("../helpers/utility");

// Projects
exports.getProjectRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const where = { userId };
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]]
        })
      )
    );
    const data = await Promise.all(
      projects.map(async project => {
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
      data
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllProjectRequest = async (req, res, next) => {
  try {
    const where = null;
    if (req.query.status) {
      where.status = req.query.status;
    }
    const projects = JSON.parse(
      JSON.stringify(
        await Project.findAll({
          where,
          order: [["createdAt", "DESC"]]
        })
      )
    );
    const data = await Promise.all(
      projects.map(async project => {
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
      data
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
          where
        })
      )
    );
    const requestData = await this.getProjectTypeData(
      project.id,
      project.projectTypes
    );
    project.projectData = requestData;

    return res.status(200).send({
      success: true,
      data: project
    });
  } catch (error) {
    return next(error);
  }
};

exports.createProject = async (data, transaction) => {
  try {
    const projectSlug = `PRJ-${utility.generateOrderId}`;
    data.projectSlug = projectSlug;
    const result = await Project.create(data, { transaction });
    return result;
  } catch (error) {
    transaction.rollback();
    return error;
  }
};

exports.deleteProjectRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { requestId } = req.params;
      const project = await Project.findOne({
        where: { id: requestId }
      });
      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Project Request"
        });
      }
      await Project.destroy({
        where: { id: requestId },
        transaction: t
      });
      await this.deleteProjectTypeData(requestId, project.projectTypes, t);
      return res.status(200).send({
        success: true,
        message: "Project deleted successfully"
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

// Land Survey Request
exports.requestForLandSurvey = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const request = req.body;
      const projectData = {
        title: req.body.title,
        userId,
        projectTypes: "land_survey"
      };
      const project = await this.createProject(projectData, t);
      request.userId = userId;
      request.projectId = project.id;
      const data = await LandSurveyProject.create(request, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateLandSurveyRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const request = req.body;
      const { requestId, title } = req.body;
      const survey = await LandSurveyProject.findOne({
        where: { id: requestId }
      });
      if (!survey) {
        return res.status(404).send({
          success: false,
          message: "Invalid Land Survey"
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
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Land Survey request updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Contractor Projects
exports.requestForContractor = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const {
        title,
        projectLocation,
        clientName,
        projectType,
        buildingType
      } = req.body;
      const projectData = {
        title,
        userId,
        projectTypes: "contractor"
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        projectType,
        buildingType
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            request.surveyPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            request.structuralPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            request.architecturalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            request.mechanicalPlan = req.files[i].path;
          }
        }
      }

      const data = await ContractorProject.create(request, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateContractorRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const {
        projectLocation,
        clientName,
        projectType,
        buildingType,
        requestId,
        title
      } = req.body;

      const project = await ContractorProject.findOne({
        where: { id: requestId }
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project"
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
        buildingType
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            request.surveyPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            request.structuralPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            request.architecturalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            request.mechanicalPlan = req.files[i].path;
          }
        }
      }
      await ContractorProject.update(request, {
        where: { id: requestId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Contractor request updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Drawing Projects
exports.drawingProjectsRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const {
        title,
        projectLocation,
        clientName,
        projectType,
        buildingType,
        drawingType
      } = req.body;
      const projectData = {
        title,
        userId,
        projectTypes: "construction_drawing"
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        projectType,
        buildingType,
        drawingType
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            request.surveyPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            request.structuralPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            request.architecturalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            request.mechanicalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "electricalPlan") {
            request.electricalPlan = req.files[i].path;
          }
        }
      }

      const data = await DrawingProject.create(request, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Drawing Project created successfully",
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateDrawingRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const {
        projectLocation,
        clientName,
        projectType,
        buildingType,
        requestId,
        title,
        drawingType
      } = req.body;

      const project = await DrawingProject.findOne({
        where: { id: requestId }
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project"
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
        drawingType
      };

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname === "surveyPlan") {
            request.surveyPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "structuralPlan") {
            request.structuralPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "architecturalPlan") {
            request.architecturalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "mechanicalPlan") {
            request.mechanicalPlan = req.files[i].path;
          }
          if (req.files[i].fieldname === "electricalPlan") {
            request.electricalPlan = req.files[i].path;
          }
        }
      }
      await DrawingProject.update(request, {
        where: { id: requestId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Drawing request updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Building Approval Projects
exports.buildingApprovalProjectsRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const { title, projectLocation, clientName, purpose } = req.body;
      const projectData = {
        title,
        userId,
        projectTypes: "building_approval"
      };
      const project = await this.createProject(projectData, t);
      const request = {
        userId,
        projectId: project.id,
        projectLocation,
        clientName,
        purpose
      };
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const name = req.files[i].fieldname;
          request[name] = req.files[i].path;
        }
      }

      const data = await BuildingProject.create(request, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Building Approval Project created successfully",
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateBuildingApprovalRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const {
        projectLocation,
        clientName,
        purpose,
        requestId,
        title
      } = req.body;

      const project = await BuildingProject.findOne({
        where: { id: requestId }
      });

      if (!project) {
        return res.status(404).send({
          success: false,
          message: "Invalid Contractor Project"
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
        purpose
      };

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const name = req.files[i].fieldname;
          request[name] = req.files[i].path;
        }
      }

      await BuildingProject.update(request, {
        where: { id: requestId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Building request updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// Geotechnical Request
exports.requestForGeoTechnicalInvestigation = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const userId = req.user.id;
      const request = req.body;
      const projectData = {
        title: req.body.title,
        userId,
        projectTypes: "geotechnical_investigation"
      };
      const project = await this.createProject(projectData, t);
      request.userId = userId;
      request.projectId = project.id;
      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const name = req.files[i].fieldname;
          request[name] = req.files[i].path;
        }
      }
      const data = await GeoTechnical.create(request, {
        transaction: t
      });
      return res.status(200).send({
        success: true,
        data
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.updateGeoTechnicalInvestigationRequest = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const request = req.body;
      const { requestId, title } = req.body;
      const survey = await GeoTechnical.findOne({
        where: { id: requestId }
      });
      if (!survey) {
        return res.status(404).send({
          success: false,
          message: "Invalid Investigation"
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
          const name = req.files[i].fieldname;
          request[name] = req.files[i].path;
        }
      }

      await GeoTechnical.update(request, {
        where: { id: requestId },
        transaction: t
      });
      return res.status(200).send({
        success: true,
        message: "Geotechnical Investigation updated successfully"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
