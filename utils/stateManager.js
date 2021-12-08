const getDepartments = async (state) => {
  let departmentResults = await state.db.query(
    "SELECT id, name FROM departments;"
  );
  state.departmentState = departmentResults[0];
};

const getRoles = async (state) => {
  let roleResults = await state.db.query(
    "SELECT id, title FROM roles;"
    );
  state.rolesState = roleResults[0];
};

const getManagers = async (state) => {
  let managerResults = await state.db.query(
    `SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) as name FROM employees m JOIN employees e ON m.id = e.manager_id;`
  );
  state.managersState = managerResults[0];
  state.managersState.unshift({ id: "NULL", name: "No Manager" });
};

module.exports = { getManagers, getRoles, getDepartments };
