const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressListRoutes = require("express-list-routes");

const sequelize = require("./config/SequelizeDb");
const route = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

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

try {
  sequelize.authenticate().then((response) => {
    console.log("Connection has been established successfully.");
    sequelize.sync().then((response) => {
      console.log("Database synced.");
    });
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

expressListRoutes(app);
