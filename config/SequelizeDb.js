const { Sequelize, DataTypes } = require("sequelize");
const sqlite = require("sqlite3");

const sequelize = new Sequelize("sqlite::memory:");

module.exports = sequelize;
