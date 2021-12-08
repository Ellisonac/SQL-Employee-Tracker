const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const cTable = require('console.table');
const pswd = require("./pass.js").module;
const coreLogic = require("./utils/functions.js");
const { getManagers, getDepartments, getRoles } = require("./utils/stateManager.js");
let db;
let departmentState;
let managersState;
let rolesState;

// Primary state object to transfer between utility functions
const state = {
  db,
  departmentState,
  managersState,
  rolesState,
};

const main = async () => {
  // Initialization of loop
  await init();

  // Primary inquirer prompt for main loop
  const options = [
    {
      type: "list",
      name: "command",
      message: "Select a command:",
      choices: Object.keys(coreLogic),
    },
  ];

  // Main loop, quits when user selects Quit option
  while (true) {
    const choice = await inquirer.prompt(options);

    if (choice.command === "Quit") break;

    await coreLogic[choice.command](state);
  }

  // Close database after main loop finishes
  state.db.close();

  return;
};

const init = async () => {
  // Connect to database
  state.db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: pswd,
      database: "employee_tracker_db",
    },
    console.log(`Connected to the employee_tracker_db database.`)
  );

  // Initialize departments, roles, and managers from database
  await getDepartments(state);
  await getRoles(state);
  await getManagers(state);

  console.log("Welcome to the database let me show you around");

  return;
};

// Run main functionality
main();
