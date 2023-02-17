/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const Addresses = require("../models/addresses");

exports.createAddress = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { title, address, state, country } = req.body;

      const _address = await Addresses.findOne({
        where: { title, address, state, country },
      });

      if (_address !== null) {
        return res.status(400).send({
          status: false,
          message: "Address exists!",
        });
      }

      const response = await Addresses.create({...req.body, status: true});

      return res.status(200).send({
        success: true,
        message: "Address created!",
        data: response
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.viewAddresses = async (req, res, next) => {
  try {
    const addresses = await Addresses.findAll();
    return res.status(200).send({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return next(error);
  }
};

exports.viewAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await Addresses.findOne({ where: { id } });
    return res.status(200).send({
      success: true,
      data: address === null ? {} : address,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.params;
      const address = await Addresses.findOne({
        where: { id },
      });
      if (address === null) {
        return res.status(404).send({
          success: false,
          message: "Address not found!",
        });
      }
      await Addresses.update(req.body, { where: { id }});
      return res.status(200).send({
        success: true,
        message: "Address updated!"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.deleteAddress = async (req, res, next) => {
  sequelize.transaction(async (t) => {
    try {
      const { id } = req.params;
      const address = await Addresses.findOne({
        where: { id },
      });
      if (address === null) {
        return res.status(404).send({
          success: false,
          message: "Address not found!",
        });
      }
      await Addresses.destroy({ where: { id } });
      return res.status(200).send({
        success: true,
        message: "Address deleted!",
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};
