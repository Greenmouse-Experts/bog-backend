const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const Testimony = sequelise.define(
  "testimonies",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    message: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isHomepage: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    },
    star: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  { paranoid: true }
);

User.hasMany(Testimony, {
  foreignKey: "userId",
  as: "review"
});
Testimony.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = Testimony;
