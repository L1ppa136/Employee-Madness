require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const FavouriteBrandModel = require("./db/brands.model.js");
const DivisionModel = require("./db/division.model");
const cors = require("cors");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/employees/", async (req, res) => {
  const salaryLimit = req.query.salaryLimit;
  const query = salaryLimit ? { currentSalary: { $lte: salaryLimit } } : {};

  const employees = await EmployeeModel.find(query).sort({ created: "desc" });

  return res.json(employees);
});

app.get("/api/equipments/", async (req, res) => {
  const equipments = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipments);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.get("/api/employees/search/:search", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find({
      firstname: req.params.search,
    }).sort({
      created: "desc",
    });
    const searchedEmployees = employees.filter(
      (employee) =>
        employee.name.firstname
          .toLowerCase()
          .includes(req.params.search.toLowerCase()) ||
        employee.name.middlename
          .toLowerCase()
          .includes(req.params.search.toLowerCase()) ||
        employee.name.lastname
          .toLowerCase()
          .includes(req.params.search.toLowerCase())
    );
    return res.json(searchedEmployees);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/missing", async (req, res) => {
  const employee = await EmployeeModel.find({ "presence.present": false });
  return res.json(employee);
});

app.get("/api/equipments/:id", async (req, res) => {
  const equipment = await EquipmentModel.findById(req.params.id);
  return res.json(equipment);
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.post("/api/equipments/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );

    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(equipment);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    const deleted = await equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/brands", async (req, res) => {
  const brands = await FavouriteBrandModel.find().sort({ created: "desc" });
  return res.json(brands);
});

app.get("/api/divisions", async (req, res) => {
  const divisions = await DivisionModel.find().sort({ created: "desc" });
  return res.json(divisions);
});

app.get("/api/divisions/:id", async (req, res) => {
  const division = await DivisionModel.findById(req.params.id);
  return res.json(division);
});

app.post("/api/divisions", async (req, res, next) => {
  const division = req.body;
  try {
    const divToBeCreated = DivisionModel.create(division);
    return res.json(divToBeCreated);
  } catch (err) {
    return next(err);
  }
});

app.patch(`/api/divisions/:id`, async (req, res, next) => {
  try {
    const divToBeUpdated = await DivisionModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.json(divToBeUpdated);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/divisions/:id", async (req, res, next) => {
  try {
    const divToBeDeleted = await DivisionModel.findByIdAndDelete(req.params.id);
    return res.json(divToBeDeleted);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
