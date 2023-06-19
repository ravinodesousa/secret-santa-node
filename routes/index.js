const router = require("express").Router();
const uploadHelper = require("../helper/UploadHelper");
const multer = require("multer");
const reader = require("xlsx");
const SecretSanta = require("../model/SecretSanta");
const User = require("../model/User");

const upload = uploadHelper.single("file");

router.post("/generate-santa-list", function (req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.

      return res.status(500).json({ message: err?.message });
    } else if (err) {
      // An unknown error occurred when uploading.

      return res.status(500).json({ message: err?.message });
    }

    // Everything went fine.
    const file = reader.readFile(req.file.path);

    const sheets = file.SheetNames;

    if (sheets.length == 0) {
      return res.status(500).json({ message: "No data found" });
    }

    const columnsArray = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[0]],
      { header: 1 }
    )[0];

    let data = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

    if (
      ![...columnsArray].includes("Employee_Name") &&
      ![...columnsArray].includes("Employee_EmailID")
    ) {
      return res.status(500).json({ message: "Invalid column names provided" });
    }

    if (data.length == 0) {
      return res.status(500).json({ message: "No data found" });
    }

    // checking if any row data is empty
    let missing_data = [];
    data.forEach((row, idx) => {
      if (!("Employee_Name" in row)) {
        missing_data.push(`Employee_Name is missing in row ${idx + 2}`);
      } else if (String(row["Employee_Name"]).trim().length == 0) {
        missing_data.push(`Employee_Name is empty in row ${idx + 2}`);
      }

      if (!("Employee_EmailID" in row)) {
        missing_data.push(`Employee_EmailID is missing in row ${idx + 2}`);
      } else if (String(row["Employee_EmailID"]).trim().length == 0) {
        missing_data.push(`Employee_EmailID is empty in row ${idx + 2}`);
      }
    });

    if (missing_data.length > 0) {
      return res.status(500).json({ message: missing_data.join(", ") });
    }

    let used_indexs = [];
    for (const employee of data) {
      let child_found = false;
      do {
        let index = Math.round(Math.random() * data.length);

        if (index >= data.length || used_indexs.includes(index)) {
          continue;
        }

        let count = await SecretSanta.count({
          where: {
            employee: employee["Employee_EmailID"],
            secret_child: data[index]["Employee_EmailID"],
          },
        });

        if (
          employee["Employee_EmailID"] != data[index]["Employee_EmailID"] &&
          count == 0
          //    &&
          //   !("Secret_Child_Name" in data[index])
        ) {
          employee["Secret_Child_Name"] = data[index]["Employee_Name"];
          employee["Secret_Child_EmailID"] = data[index]["Employee_EmailID"];
          child_found = true;
          used_indexs.push(index);

          break;
        }
      } while (!child_found);
    }

    return res.status(200).json(data);
  });
});

router.post("/save-santa-list", async function (req, res) {
  if ("secretSantaList" in req.body) {
    let lastRecord = await SecretSanta.findOne({ order: [["id", "DESC"]] });

    for (item of req.body?.secretSantaList) {
      let employee = await User.findOne({
        where: { email: item["Employee_EmailID"] },
      });

      if (employee == null) {
        employee = await User.create({
          email: item["Employee_EmailID"],
          name: item["Employee_Name"],
        });
      }

      let secretChild = await User.findOne({
        where: { email: item["Secret_Child_EmailID"] },
      });

      if (secretChild == null) {
        secretChild = await User.create({
          email: item["Secret_Child_EmailID"],
          name: item["Secret_Child_Name"],
        });
      }

      let secretSantaItem = await SecretSanta.create({
        employee: employee?.email,
        secret_child: secretChild?.email,
        date: new Date(),
        secret_id: lastRecord ? lastRecord?.secret_id + 1 : 1,
      });
    }

    res.status(200).json({ message: "data saved" });
  } else {
    res.status(500).json({ message: "no data found" });
  }
});

router.get("/santa-list", async function (req, res) {
  let data = [];
  let allSecretIds = await SecretSanta.findAll({
    group: "secret_id",
    order: [["secret_id", "DESC"]],
  });

  for (const item of allSecretIds) {
    let allRecords = await SecretSanta.findAll({
      where: {
        secret_id: item.secret_id,
      },
      include: [{ all: true }],
    });
    data.push(allRecords);
  }

  res.status(200).json(data);
});

module.exports = router;
