const inquirer = require("inquirer");

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

module.exports = { updateEmployee };
