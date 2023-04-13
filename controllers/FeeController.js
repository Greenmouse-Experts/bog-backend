require("dotenv").config();
const Fees = require("../models/fee");

exports.viewCommitmentFee = async (req, res, next) => {
  try {
    const commitmentFee = await Fees.findOne({
      where: { title: "commitment fee" },
      attributes: {exclude: ['id']}
    });
    return res.send({
      success: true,
      data: commitmentFee !== null ? commitmentFee : {},
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCommitment = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const commitmentFee = await Fees.findOne({
      where: { title: "commitment fee" },
    });

    if (commitmentFee === null) {
      const _response = await Fees.create(
        { amount, title: "commitment fee" }
      );
    }

    const response = await Fees.update(
      { amount },
      { where: { title: "commitment fee" } }
    );
    return res.send({
      success: true,
      message: "Commitment fee saved successfully!",
    });
  } catch (error) {
    return next(error);
  }
};
