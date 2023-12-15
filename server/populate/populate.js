/*
Loading the .env file and creates environment variables from it
*/
require('dotenv').config();
const mongoose = require('mongoose');
const names = require('./names.json');
const levels = require('./levels.json');
const positions = require('./positions.json');
const designations = require('./designations.json');
const types = require('./types.json');
const brands = require('./brands.json');
const colors = require('./colors.json');
const divisions = require('./divisions.json');
const locations = require('./locations.json');
const EmployeeModel = require('../db/employee.model');
const EquipmentModel = require('../db/equipment.model');
const FavouriteBrandModel = require('../db/brands.model');
const DivisionModel = require('../db/division.model');

const averageSalary = 50000;
const deviation = 10000;

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error('Missing MONGO_URL environment variable');
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const randomSalary = (desired, avg, dev) => {
  const min = avg - dev;
  const max = avg + dev;
  const range = max - min;
  let randomSalary;
  let roundedSalary;
  if (desired) {
    randomSalary = Math.floor(Math.random() * range) + max;
    roundedSalary = Math.ceil(randomSalary / 1000) * 1000;
    return roundedSalary;
  } else {
    randomSalary = Math.floor(Math.random() * range) + min;
    roundedSalary = Math.ceil(randomSalary / 1000) * 1000;
    return roundedSalary;
  }
};

function getRandomDate(startYear, endYear) {
  const startDate = new Date(startYear, 0, 1).getTime();
  const endDate = new Date(endYear + 1, 0, 1).getTime() - 1;
  const randomTimestamp = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTimestamp);
}

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  await FavouriteBrandModel.deleteMany({});
  await DivisionModel.deleteMany({});

  const brandDocument = await FavouriteBrandModel.create(brands.map((name) => ({ name })));
  const divisionDocument = divisions.map((name) => {
    const division = { name: name, boss: null, location: pick(locations) };
    return division;
  });

  const createdDivisions = await DivisionModel.create(...divisionDocument);

  const brandIds = brandDocument.map((brand) => brand._id);
  const divisionIds = createdDivisions.map((division) => division._id);

  const employees = names.map((name) => {
    const nameParts = name.split(' ');
    const employee = {
      name: { firstname: nameParts[0], middlename: '', lastname: nameParts[nameParts.length - 1] },
      level: pick(levels),
      position: pick(positions),
      presence: {
        date: new Date(),
        present: false,
      },
      equipment: '',
      favouriteBrand: pick(brandIds),
      startingDate: getRandomDate(2010, 2022),
      currentSalary: randomSalary(false, averageSalary, deviation),
      desiredSalary: randomSalary(true, averageSalary, deviation),
      favouriteColor: pick(colors),
      division: pick(divisionIds),
    };
    if (nameParts.length > 2) {
      employee.name.middlename = nameParts[1];
    }

    return employee;
  });

  const createdEmployees = await EmployeeModel.create(...employees);

  createdEmployees.forEach((employee) => (employee.division = pick(divisionIds)));

  divisionIds.forEach((id) => {
    let worksInDivision = createdEmployees.filter((emp) => id === emp.division);
    DivisionModel.findByIdAndUpdate(id, {
      boss: pick(worksInDivision),
    }).exec();
  });

  console.log('Employees created');
  console.log('Favourite brands created');
  console.log('Divisions created');
};

const populateEquipments = async () => {
  await EquipmentModel.deleteMany({});

  const equipments = designations.map((designation) => ({
    designation,
    type: pick(types),
    amount: Math.floor(Math.random() * 20) + 1,
  }));

  await EquipmentModel.create(...equipments);
  console.log('Equipments created');
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();

  await populateEquipments();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
