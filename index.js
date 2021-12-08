const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const pswd = require("./pass.js").module;
//const coreLogic = require("./utils/functions.js")
let db;
let departmentState;
let managersState;
let rolesState;


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

    await coreLogic[choice.command]();

  }
  
  db.close();

  return;
};

const init = async () => {

  // Connect to database
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

  await getDepartments();
  await getRoles();
  await getManagers();
  
 
  console.log("Welcome to the database let me show you around");
};

const getDepartments = async () => {
  let departmentResults = await db.query('SELECT id, name FROM departments;');
  departmentState = departmentResults[0];
}

const getRoles = async () => {
  let roleResults = await db.query('SELECT id, title FROM roles;');
  rolesState = roleResults[0];
}

const getManagers = async () => {
  let managerResults = await db.query(`SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) as name FROM employees m JOIN employees e ON m.id = e.manager_id;`);
  managersState = managerResults[0];
  console.log(managersState)
  managersState.unshift({id:'NULL',name:'No Manager'});
}

const viewAll = async () => {
  const query = `SELECT 
    e.id, e.first_name, e.last_name, r.title, d.name as departments, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    LEFT JOIN employees m ON e.manager_id = m.id
    ORDER BY e.id ASC;`;

  const results = await db.query(query);

  console.table(results[0]);
};

const viewAllRoles = async () => {
  const query = `SELECT 
  r.id, r.title, r.salary, d.name as department
  FROM roles r
  JOIN departments d
  ON r.department_id = d.id
  ORDER BY r.id ASC;`;

  const results = await db.query(query);

  console.table(results[0]);

};

const viewAllDepartments = async () => {
  const query = `SELECT 
    id, name as departments
    FROM departments
    ORDER BY id ASC;`;

  const results = await db.query(query);

  console.table(results[0]);
};

const addEmployee = async () => {

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
      choices: rolesState.map(role => role.title)
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee's manager",
      choices: managersState.map(manager => manager.name)
    },
  ];

  const response = await inquirer.prompt(questions);

  const role_id = rolesState.filter(role => role.title === response.title)[0].id;

  const manager_id = managersState.filter(manager => manager.name === response.manager)[0].id;

  const insertQuery = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${response.first}','${response.last}','${role_id}',${manager_id}) `;

  db.query(insertQuery)
  
};

const updateEmployee = async () => {

  const questions = [
    {
      type: "input",
      name: "id",
      message: "Select an employee ID",
    },
    {
      type: "input",
      name: "first",
      message: "Enter the employee's new first name or blank to skip",
    },
    {
      type: "input",
      name: "last",
      message: "Enter the employee's new last name or blank to skip",
    },
    {
      type: "list",
      name: "title",
      message: "Enter the employee's new role",
      choices: rolesState.map(role => role.title)
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee's new manager",
      choices: managersState.map(manager => manager.name)
    },
  ];

  const response = await inquirer.prompt(questions);

  if (!response.id) return;

  const employeeQuery = await db.query(`SELECT * FROM employees WHERE id = ${response.id}`)

  const employee = employeeQuery[0];

  console.log(employee);

  if (employee) {
    const role_id = rolesState.filter(role => role.title === response.title)[0].id;

    const manager_id = managersState.filter(manager => manager.name === response.manager)[0].id;
  
    const insertQuery = `UPDATE employees SET 
    first_name = '${response.first || employee.first_name}',
    last_name = '${response.first || employee.last_name}',
    manager_id = '${manager_id}',
    role_id = '${role_id || employee.role_id}',
    WHERE id = '${response.id}';`;
  
    db.query(insertQuery)
  } else {
    console.log(`Employee ID ${response.id} not found.`);
  }
  return;
};

const addRole = async () => {
  const questions = [
    {
      type: "input",
      name: "title",
      message: "Enter the role Title",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the role Salary",
    },
    {
      type: "list",
      name: "dept",
      message: "Enter the role Department",
      choices: departmentState.map(dept => dept.name)
    },
  ];

  const response = await inquirer.prompt(questions);

  const dept_id = departmentState.filter(dept => dept.name === response.dept)[0].id;

  const insertQuery = `INSERT INTO roles(title, salary, department_id) VALUES ('${response.title}','${response.salary}','${dept_id}');`;

  db.query(insertQuery);

  getRoles();
  return;
};

const addDepartment = async () => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the department name:",
    },
  ];

  const response = await inquirer.prompt(questions);

  const insertQuery = `INSERT INTO departments(name) VALUES ('${response.name}');`;

  db.query(insertQuery);

  getDepartments();
  return;
};

const coreLogic = {
  "View All Employees": viewAll,
  "View All Roles": viewAllRoles,
  "View All Departments": viewAllDepartments,
  "Add Employee": addEmployee,
  "Update Employee Role": updateEmployee,
  "Add Role": addRole,
  "Add Department": addDepartment,
  "Quit": "Quit"
};

main();

