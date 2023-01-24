DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;
CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL
);
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  manager_id INT UNSIGNED  
);

use employees;
INSERT INTO department
    (name)
VALUES
   ('Human Resources'),
   ('Engineering'),
   ('Customer service'),
   ('Marketing');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('General Manager', 400000, 1),
    ('Assistant Manager', 300000, 1),
    ('Sales Analyst', 600000, 2),
    ('Customer Service Leader', 800000, 2),
    ('Social Media Manager', 1200000, 3),
    ('Marketing Manager', 1500000, 3),
    ('CEO', 5000000, 4),
    ('CFO', 3000000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Wick', 1, NULL),
    ('Stephen', 'Strange', 2, 1),
    ('Bill', 'Denbrough', 3, NULL),
    ('John', 'Coffey', 4, 3),
    ('Kenny', 'McCormick', 5, NULL),
    ('Bob', 'Belcher', 6, 5),
    ('Homer', 'Simpson', 7, NULL),
    ('Randy', 'Marsh', 8, 7);