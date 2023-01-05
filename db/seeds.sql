INSERT INTO departments (department_name)
VALUES
        ('Human Resources'),
        ('Engineering'),
        ('Customer service');


INSERT INTO managers (manager_name)
VALUES
        ('Homer simpson'),
        ('Bob Belcher'),
        ('Randy Marsh');

INSERT INTO roles (title, salary, department_id)
VALUES
        ('HR Rep', 70000, 1),
        ('Engineering executive', 120000, 2),
        ('Customer service leader', 55000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
        ('John Wick', '', 1, 3),
        ('Stephen', 'Strange', 2, 1),
        ('Bill', 'Denbrough', 3, 2);