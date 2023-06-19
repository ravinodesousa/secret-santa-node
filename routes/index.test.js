const request = require("supertest");
const path = require("path");

const { app, initDB } = require("../index");

beforeAll(async () => {
  console.log("Before all...");
  await initDB();
});

describe("routes ", () => {
  it("GET / => 404 not found", async () => {
    return request(app).get("/").expect(404);
  });

  it("GET /santa-list  => List of sant list that were saved", async () => {
    return request(app)
      .get("/santa-list")
      .expect(200)
      .then((response) => {
        for (const item of response.body) {
          expect(item).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                employee_data: expect.any(Object),
                secret_child_data: expect.any(Object),
              }),
            ])
          );
        }
        console.log(response.body);
      });
  });

  it("POST /generate-santa-list => array of items", async () => {
    const employeeFile = path.resolve(
      __dirname,
      `../uploads/Employee-List.xlsx`
    );

    return request(app)
      .post("/generate-santa-list")
      .attach("file", employeeFile)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Employee_Name: expect.any(String),
              Employee_EmailID: expect.any(String),
              Secret_Child_Name: expect.any(String),
              Secret_Child_EmailID: expect.any(String),
            }),
          ])
        );
      })
      .catch((err) => {
        console.log("error", err);
      });
  });

  it("POST /save-santa-list => success message", async () => {
    let data = [];

    return request(app)
      .post("/save-santa-list")
      .expect(200)
      .send({
        secretSantaList: data,
      })
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: "data saved",
          })
        );
      });
  });
});
