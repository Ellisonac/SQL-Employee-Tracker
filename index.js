const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const pswd = require("./pass.js").module;
const coreLogic = require("./utils/functions.js")
const { getManagers, getDepartments, getRoles } = require("./utils/stateManager.js")
let db;
let departmentState;
let managersState;
let rolesState;

// Primary state object
const state = {
  db, departmentState, managersState, rolesState
};


const main = async () => {
  // Initialization of loop
  await init();
  
  const options = [
    {
      type: "list",
      name: "command",
      message: "Select a command:",
      choices: Object.keys(coreLogic),
    },
  ];

  

  while (true) {
    const choice = await inquirer.prompt(options);

    if (choice.command === 'Quit') break;

    await coreLogic[choice.command](state);

  }
  
  state.db.close();

  return;
};

const init = async () => {

  // Connect to database
  state.db = await mysql.createConnection(
    {
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: pswd,
      database: "employee_tracker_db",
    }, 
    console.log(`Connected to the employee_tracker_db database.`)
  );

  await getDepartments(state);
  await getRoles(state);
  await getManagers(state);
  
 
  console.log("Welcome to the database let me show you around");
};



main();

