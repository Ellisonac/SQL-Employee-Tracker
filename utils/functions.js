const { viewAll, viewAllRoles, viewAllDepartments } = require("./views.js");
const { addEmployee, addDepartment, addRole } = require("./addEntries");
const { updateEmployee } = require("./updateEntries");

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
