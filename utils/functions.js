const { getDepartments, getRoles } = require("./stateManager.js");
const inquirer = require("inquirer");

const viewAll = async (state) => {
  const query = `SELECT 
    e.id, e.first_name, e.last_name, r.title, d.name as departments, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    LEFT JOIN employees m ON e.manager_id = m.id
    ORDER BY e.id ASC;`;

  const results = await state.db.query(query);

  console.table(results[0]);
};

const viewAllRoles = async (state) => {
  const query = `SELECT 
  r.id, r.title, r.salary, d.name as department
  FROM roles r
  JOIN departments d
  ON r.department_id = d.id
  ORDER BY r.id ASC;`;

  const results = await state.db.query(query);

  console.table(results[0]);
};

const viewAllDepartments = async (state) => {
  const query = `SELECT 
    id, name as departments
    FROM departments
    ORDER BY id ASC;`;

  const results = await state.db.query(query);

  console.table(results[0]);
};

// Allow users to add employees to the database
const addEmployee = async (state) => {
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
      choices: state.rolesState.map((role) => role.title),
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee's manager",
      choices: state.managersState.map((manager) => manager.name),
    },
  ];

  const response = await inquirer.prompt(questions);

  const role_id = state.rolesState.filter(
    (role) => role.title === response.title
  )[0].id;

  const manager_id = state.managersState.filter(
    (manager) => manager.name === response.manager
  )[0].id;

  const insertQuery = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ('${response.first}','${response.last}','${role_id}',${manager_id}) `;

  state.db.query(insertQuery);
};

// Allow users to update an employee entries name, role, and manager
const updateEmployee = async (state) => {
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
      choices: state.rolesState.map((role) => role.title),
    },
    {
      type: "list",
      name: "manager",
      message: "Select the employee's new manager",
      choices: state.managersState.map((manager) => manager.name),
    },
  ];

  const response = await inquirer.prompt(questions);

  if (!response.id) return;

  const employeeQuery = await state.db.query(
    `SELECT * FROM employees WHERE id = ${response.id}`
  );

  const employee = employeeQuery[0];

  console.log(employee);

  if (employee) {
    const role_id = state.rolesState.filter(
      (role) => role.title === response.title
    )[0].id;

    const manager_id = state.managersState.filter(
      (manager) => manager.name === response.manager
    )[0].id;

    const insertQuery = `UPDATE employees SET 
    first_name = '${response.first || employee.first_name}',
    last_name = '${response.first || employee.last_name}',
    manager_id = '${manager_id}',
    role_id = '${role_id || employee.role_id}',
    WHERE id = '${response.id}';`;

    state.db.query(insertQuery);
  } else {
    console.log(`Employee ID ${response.id} not found.`);
  }
  return;
};

// Allow users to add new roles
const addRole = async (state) => {
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
      choices: state.departmentState.map((dept) => dept.name),
    },
  ];

  const response = await inquirer.prompt(questions);

  const dept_id = state.departmentState.filter(
    (dept) => dept.name === response.dept
  )[0].id;

  const insertQuery = `INSERT INTO roles(title, salary, department_id) VALUES ('${response.title}','${response.salary}','${dept_id}');`;

  state.db.query(insertQuery);

  getRoles(state);
  return;
};

// Allow users to add new departments
const addDepartment = async (state) => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the department name:",
    },
  ];

  const response = await inquirer.prompt(questions);

  const insertQuery = `INSERT INTO departments(name) VALUES ('${response.name}');`;

  state.db.query(insertQuery);

  getDepartments(state);
  return;
};

// Primary object to handle function options
const coreLogic = {
  "View All Employees": viewAll,
  "View All Roles": viewAllRoles,
  "View All Departments": viewAllDepartments,
  "Add Employee": addEmployee,
  "Update Employee Role": updateEmployee,
  "Add Role": addRole,
  "Add Department": addDepartment,
  Quit: "Quit",
};

module.exports = coreLogic;
