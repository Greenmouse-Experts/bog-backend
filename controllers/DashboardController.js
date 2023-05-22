/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const sequelize = require("../config/database/connection");
const Project = require("../models/Project");
const ServiceProvider = require("../models/ServiceProvider");

exports.getServicePartnerProjects = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { userId } = req.params;
      const completedProject = await Project.count({
        where: { serviceProviderId: userId, status: "completed" }
      });
      const ongoingProject = await Project.count({
        where: { serviceProviderId: userId, status: "ongoing" }
      });
      const assignedProject = await Project.count({
        where: { serviceProviderId: userId }
      });
      const dispatchedProject = await ServiceProvider.count({
        where: { userId }
      });
      const recentProjectRequest = await ServiceProvider.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        limit: 5
      });
      const myProjects = await Project.findAll({
        where: { serviceProviderId: userId },
        order: [["createdAt", "DESC"]]
      });
      const data = {
        assignedProject,
        completedProject,
        dispatchedProject,
        ongoingProject,
        recentProjectRequest,
        myProjects
      };
      return res.status(200).send({
        success: true,
        data
      });
    } catch (error) {
      return next(error);
    }
  });
};
