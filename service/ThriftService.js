const Sequelize = require("sequelize");
const ThriftGroup = require("../models/Thrift");
const User = require("../models/User");
const Members = require("../models/Members");
const PayoutSequence = require("../models/PayoutSequence");

exports.createNewGroup = async (request, transaction) => {
  const group = await ThriftGroup.create(request, { transaction });
  return group;
};

exports.updateGroup = async (data, transaction) => {
  await ThriftGroup.update(data, { where: { id: data.id }, transaction });
  return true;
};

exports.checkForGroup = async name => {
  const group = await ThriftGroup.findOne({ where: { name } });
  return group;
};

exports.findAllGroup = async () => {
  const groups = await ThriftGroup.findAll({
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "groupStatus",
      "totalAmountSaved",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.findAllUserGroup = async userId => {
  const groups = await ThriftGroup.findAll({
    where: { adminId: userId },
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "groupStatus",
      "totalAmountSaved",
      "createdAt"
    ],
    include: [
      {
        model: Members,
        as: "group_members",
        attributes: ["id", "totalAmount", "hasCollect"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"]
          }
        ]
      }
    ]
  });
  return groups;
};

exports.findAGroup = async id => {
  const groups = await ThriftGroup.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      "adminId",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "groupStatus",
      "totalAmountSaved",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.SearchForGroup = async conditions => {
  const groups = await ThriftGroup.findAll({
    where: conditions,
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "groupStatus",
      "totalAmountSaved",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.joinAGroup = async (data, transaction) => {
  const member = await Members.create(data, { transaction });
  return member;
};

exports.checkIfMember = async (userId, groupId) => {
  const member = await Members.findOne({ where: { userId, groupId } });
  return member;
};

exports.fetchAllUserAtRandom = async groupId => {
  const groups = await Members.findAll({
    where: { groupId },
    order: [Sequelize.fn("RAND")]
  });
  return groups;
};

exports.creatPayoutTable = async (request, transaction) => {
  const table = await PayoutSequence.bulkCreate(request, { transaction });
  return table;
};

exports.addUserToPayoutTable = async (request, transaction) => {
  const table = await PayoutSequence.create(request, { transaction });
  return table;
};

exports.findAllOngoingGroup = async () => {
  const groups = await ThriftGroup.findAll({
    where: { groupStatus: "ongoing" }
  });
  return groups;
};

exports.getAllUserInGroup = async groupId => {
  const members = await Members.findAll({ where: { groupId } });
  return members;
};

exports.updateMemberAmountInGroup = async data => {
  await Members.update(data, {
    where: { groupId: data.groupId, userId: data.userId }
  });
  return true;
};

exports.updateAmountSaved = async data => {
  await ThriftGroup.update(data, { where: { id: data.id } });
  return true;
};

exports.findAllGroupPayout = async groupId => {
  const payouts = await PayoutSequence.findAll({
    where: { groupId },
    order: [["sequenceNumber", "ASC"]],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name"]
      }
    ]
  });
  return payouts;
};
