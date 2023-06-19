const { Sequelize, DataTypes } = require("sequelize");
const User = require("./User");
const sequelize = require("../config/SequelizeDb");

const SecretSanta = sequelize.define("SecretSanta", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  secret_id: {
    // this id helps to group records
    type: DataTypes.INTEGER,
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

SecretSanta.belongsTo(User, { foreignKey: "employee", as: "employee_data" });
SecretSanta.belongsTo(User, {
  foreignKey: "secret_child",
  as: "secret_child_data",
});

module.exports = SecretSanta;
