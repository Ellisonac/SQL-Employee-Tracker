-- Create initial seed data
USE employee_tracker_db;

INSERT INTO
  departments(name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Production');

INSERT INTO
  roles(title, salary, department_id)
VALUES
  ('Engineer',85000,1),
  ('Engineeeer',110000,1),
  ('Technical Lead',130000,1),
  ('Salesperson',75000,2),
  ('Sales Manager',100000,2),
  ('Calculator Wizard',100000,3),
  ('Slide Ruler',135000,3),
  ('Artisan',75000,4),
  ('Shop Manager',105000,3);

INSERT INTO
  employees (first_name, last_name, role_id, manager_id)
VALUES 
  ('Mike','Finn',2,4),
  ('Sandra','Cinna',1,4),
  ('Clem','Lemon',1,4),
  ('Will','Tailor',3,NULL),
  ('Jim','Bean',5,NULL),
  ('James','Legume',4,5),
  ('Jameson','Pinto',4,5),
  ('Johannes','Kepler',7,NULL),
  ('Tim','Fire',6,8),
  ('Mark','Sharp',8,12),
  ('Carc','Withac',8,12),
  ('Manny','Floor',9,NULL);
  