const inquirer = require("inquirer");
const { getDepartments, getRoles } = require("./stateManager.js");

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

module.exports = { addEmployee, addRole, addDepartment };
