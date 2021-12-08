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

module.exports = { viewAll, viewAllRoles, viewAllDepartments };
