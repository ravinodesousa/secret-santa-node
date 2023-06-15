const multer = require("multer");
const path = require("path");
// console.log("path.basename", path);

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    console.log("filename1234", file);
    let filename = file.originalname.split(".");
    console.log("filename123", filename);
    cb(
      null,
      filename[0] + "_" + new Date().getTime().toString() + "_" + filename[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  let filename = file.originalname.split(".");

  if (filename.length == 2) {
    if (filename[1] == "xlsx" || filename[1] == "csv") {
      cb(null, true);
    } else {
      cb(new Error("Only xlsx and csv format allowed"));
    }
  } else {
    cb(new Error("Invalid filename"));
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 6,
  // },
  fileFilter: fileFilter,
});

module.exports = upload;
