const inquirer = require("inquirer");

// Allow users to update an employee entries name, role, and manager
const updateEmployee = async (state) => {
  // Get a valid employeeID from user input
  const employee = await getEmployeeID(state);

  const questions = [
    {
      type: "input",
      name: "first",
      message: `Enter the ${employee.first_name}'s new first name or blank to skip`,
    },
    {
      type: "input",
      name: "last",
      message: `Enter the ${employee.first_name}'s new last name or blank to skip`,
    },
    {
      type: "list",
      name: "title",
      message: `Enter the ${employee.first_name}'s new role`,
      choices: state.rolesState.map((role) => role.title),
    },
    {
      type: "list",
      name: "manager",
      message: `Select the ${employee.first_name}'s new manager`,
      choices: state.managersState.map((manager) => manager.name),
    },
  ];

  //Prompt user to update pulled employee
  const response = await inquirer.prompt(questions);

  if (employee) {
    const role_id = state.rolesState.filter(
      (role) => role.title === response.title
    )[0].id;

    const manager_id = state.managersState.filter(
      (manager) => manager.name === response.manager
    )[0].id;

    const insertQuery = `UPDATE employees SET 
    first_name = '${response.first || employee.first_name}',
    last_name = '${response.last || employee.last_name}',
    manager_id = ${manager_id},
    role_id = '${role_id || employee.role_id}'
    WHERE id = '${employee.id}';`;

    await state.db.query(insertQuery);
  } else {
    console.log(`Employee ID ${response.id} not found.`);
  }
  return;
};

const getEmployeeID = async (state) => {
  let isValid;
  let employee;
  while (!isValid) {
    const idResponse = await inquirer.prompt([
      {
      type: "input",
      name: "id",
      message: "Select an employee ID",
      },
    ]);

    try {
      const employeeQuery = await state.db.query(
        `SELECT * FROM employees WHERE id = ${idResponse.id}`
      );
      employee = employeeQuery[0][0];

      isValid = true
    } catch (err) {
      isValid = false;
      console.log('Please enter a valid employee ID');
    }
  }

  return employee;
}

module.exports = { updateEmployee };
