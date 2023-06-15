const { Sequelize, DataTypes } = require("sequelize");
const User = require("./User");
const sequelize = require("../config/SequelizeDb");

const SecretSanta = sequelize.define("SecretSanta", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employee: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: "email",
    },
  },
  secret_child: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: "email",
    },
  },
  date: DataTypes.DATE,
});

module.exports = SecretSanta;
