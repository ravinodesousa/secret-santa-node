const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressListRoutes = require("express-list-routes");

const sequelize = require("./config/SequelizeDb");
const route = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// routes
app.use("/", route);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

if (!Object.keys(process.env).includes("JEST_WORKER_ID")) {
  initDB();
}
// expressListRoutes(app);

module.exports = { app, initDB };
