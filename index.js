const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const pswd = require("./pass.js").module;
let db;


const main = async () => {
  // Initialization of loop
  init();

  db = await mysql.createConnection(
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
    

  const options = [
    {
      type: "list",
      name: "command",
      message: "Select a command:",
      choices: Object.keys(coreLogic),
    },
  ];

  const choice = await inquirer.prompt(options);

  coreLogic[choice.command]();

  return;
};

const init = async () => {

  // Connect to database
  
 
  console.log("Welcome to the database let me show you around");
};

const viewAll = async () => {
  const query = `SELECT 
    e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    LEFT JOIN employees m ON e.manager_id = m.id
    ORDER BY e.id ASC;`;

  const results = await db.query(query);

  console.table(results[0]);
};

const addEmployee = async () => {


  let roleResults = await db.query('SELECT id, title FROM roles;');
  let roles = roleResults[0];
  console.log(roles);
  
  let managerResults = await db.query(`SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) as name FROM employees m JOIN employees e ON m.id = e.manager_id;`);
  let managers = managerResults[0];

  const questions = [
    {
      type: "input",
      name: "first",
      message: "Enter the employee's first name",
    },
    {
      type: "input",
      name: "last",
      message: "Enter the employee's last name",
    },
    {
      type: "list",
      name: "title",
      message: "Enter the employee's role",
      choices: roles.map(role => role.title)
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee's manager",
      choices: managers.map(manager => manager.name)
    },
  ];

  const response = await inquirer.prompt(questions);

  const role_id = roles.filter(role => role.title === response.title)[0].id;

  const manager_id = managers.filter(manager => manager.name === response.manager)[0].id;


  const insertQuery = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${response.first}','${response.last}','${role_id}','${manager_id}') `;

  db.query(insertQuery)
  
};

const updateEmployee = () => {};

const viewAllRoles = () => {};

const addRole = () => {};

const viewAllDepartments = () => {};

const addDepartment = () => {};

const coreLogic = {
  "View All Employees": viewAll,
  "Add Employee": addEmployee,
  "Update Employee Role": updateEmployee,
  "View All Roles": viewAllRoles,
  "Add Role": addRole,
  "View All Departments": viewAllDepartments,
  "Add Department": addDepartment,
};

main();
