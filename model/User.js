const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/SequelizeDb");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = User;
