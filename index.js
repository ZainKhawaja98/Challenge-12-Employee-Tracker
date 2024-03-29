const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('console.table');

let connection = null;
async function connectDatabase() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Memorize1998!',
            database: 'employees',
       
            port: 3306
        });

        await promptActions();
        

        connection.close();
    } catch (err) {
        console.log("Failed Connection Database"); 
    }
}

async function promptActions() {
    while (true) {
        const res = await inquirer
            .prompt([
                {
                    type: "list",
                    name: "action",
                    message: "What do you want to do?",
                    choices: [
                        "View All Departments",
                        "View All Roles",
                        "View All Employees",
                        "Add A Department",
                        "Add A Role",
                        "Add An Employee",
                        "Update Employee Role",
                        "Exit"
                    ],
                },
            ]);

        if (res.action == "Exit")
            break;

        if (res.action == "View All Departments")
            await displayAllDepartments();

        if (res.action == "View All Roles")
            await displayAllRoles();

        if (res.action == "View All Employees")
            await displayAllEmployees();

        if (res.action == "Add A Department")
            await addDepartment();

        if (res.action == "Add A Role")
            await addRole();

        if (res.action == "Add An Employee")
            await addEmployee();

        if (res.action == "Update Employee Role")
            await updateEmployeeRole();
    }
}

async function displayAllDepartments() {
    const [rows, fields] = await connection.execute('SELECT * FROM `department` Order by id', []);
    console.log("")
    console.table(rows);
}


async function displayAllRoles() {
    const [rows, fields] = await connection.execute('SELECT a.id as `role_id`, a.title, b.name as department, a.salary FROM `role` as a LEFT JOIN `department` as b ON a.department_id = b.id Order by a.id', []);
    console.log("")
    console.table(rows);
}

async function displayAllEmployees() {
    const [rows, fields] = await connection.execute(`
                    SELECT a.id AS employee_id, a.first_name, a.last_name, b.title AS job, c.name AS department, b.salary, CONCAT(d.first_name, " ", d.last_name) AS manager
                    FROM employee AS a
                    LEFT JOIN role AS b ON a.role_id = b.id
                    LEFT JOIN department AS c ON b.department_id = c.id
                    LEFT JOIN employee AS d ON a.manager_id = d.id
                    ORDER BY a.id
            `, []);
    console.log("")
    console.table(rows);
}

async function addDepartment() {
    const res = await inquirer
        .prompt([
            //name
            {
                type: "input",
                name: "name",
                message: "Enter department name",
                validate: (val) => {
                    if (val) {
                        return true;
                    } else {
                        console.log("/nDepartment's name again.");
                        return false;
                    }
                },
            }
        ]);

    try {
        await connection.execute(`INSERT INTO department (name) VALUES (?)`, [res.name]);
        console.log(`The ${res.name} was added to the database`);
    } catch (err) {
        console.log(`Couldn't add deparment "${res.name}"`);
    }

}


async function addRole() {
    const res = await inquirer
        .prompt([
            //title
            {
                type: "input",
                name: "title",
                message: "Enter the title of the role",
                validate: (val) => {
                    if (val) {
                        return true;
                    } else {
                        console.log("\nRole's title again.");
                        return false;
                    }
                },
            },
            //salary
            {
                type: "input",
                name: "salary",
                message: "Enter the salary of the role",
                validate: (val) => {
                    if (val) {
                        return true;
                    } else {
                        console.log("\nRole's salary again.");
                        return false;
                    }
                },
            },
            //department
            {
                type: "input",
                name: "department",
                message: "Enter the department the role belongs to",
                validate: async (val) => {
                    if (val) {
                        const [rows, fields] = await connection.execute(`Select * From department Where name = ?`, [val]);

                        if (rows.length < 1) {
                            console.log("\nDepartment does not exist");
                            return false;
                        }
                        return true;
                    } else {
                        console.log("\nRole's department again.");
                        return false;
                    }
                },
            }
        ]);

    try {
        // find department id
        const [rows, fields] = await connection.execute(`Select * From department Where name = ?`, [res.department]);
        // console.log(rows)
        await connection.execute(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [res.title, res.salary, rows[0]['id']]);
        console.log(`Added ${res.title} to the database`);
    } catch (err) {
        console.log(`Failed to add department "${res.title}"`);
    }

}


async function addEmployee() {
    const res = await inquirer
        .prompt([
            //first_name
            {
                type: "input",
                name: "first_name",
                message: "Enter employee's first name",
                validate: (val) => {
                    if (val) {
                        return true;
                    } else {
                        console.log("\Employee's First Name again.");
                        return false;
                    }
                },
            },
            //last_name
            {
                type: "input",
                name: "last_name",
                message: "Enter employee's last name",
                validate: (val) => {
                    if (val) {
                        return true;
                    } else {
                        console.log("\Employee's Last Name again.");
                        return false;
                    }
                },
            },
            //role
            {
                type: "input",
                name: "role",
                message: "Enter employee's role",
                validate: async (val) => {
                    if (val) {
                        const [rows, fields] = await connection.execute(`Select * From role Where title = ?`, [val]);

                        if (rows.length < 1) {
                            console.log("\nRole does not exist");
                            return false;
                        }
                        return true;
                    } else {
                        console.log("\nEmployee's Role again.");
                        return false;
                    }
                },
            },
            //manager
            {
                type: "input",
                name: "manager",
                message: "Enter employee's manager",
            }
        ]);

    try {
        // find department id
        const [rows1, fields1] = await connection.execute(`Select * From role Where title = ?`, [res.role]);
        const [rows2, fields2] = await connection.execute(`Select * From employee Where CONCAT(first_name, " ", last_name) = ?`, [res.manager]);
        // console.log(rows1);
        const manager_id = rows2.length > 0 ? rows2[0]['id'] : 0;
        // console.log("manager_id", manager_id);
        await connection.execute(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [res.first_name, res.last_name, rows1[0]['id'], manager_id]);
        console.log(`Added ${res.first_name} ${res.last_name} to the database`);
    } catch (err) {
        console.log(`Failed to add department "${res.first_name} ${res.last_name}"`);
    }

}

async function updateEmployeeRole() {
    const [rows, fields] = await connection.execute(`Select * From employee`, []);
    const res = await inquirer
        .prompt([
            {
                type: "list",
                name: "user",
                message: "What would you like to do?",
                choices: rows.map(row => row['first_name'] + ' ' + row['last_name'])
            },

        ]);

    // console.log(res.user);

    const [rows1, fields1] = await connection.execute(`Select * From role`, []);

    const res1 = await inquirer
        .prompt([
            {
                type: "list",
                name: "title",
                message: "Which role do you want?",
                choices: rows1.map(row => row['title']),
            }
        ]);

    const [rows2, fields2] = await connection.execute(`Select * From employee Where CONCAT(first_name, " ", last_name) = ?`, [res.user]);
    const [rows3, fields3] = await connection.execute(`Select * From role Where title = ?`, [res1.title]);

    const employee_id = rows2.length > 0 ? rows2[0]['id'] : 0;
    const role_id = rows3.length > 0 ? rows3[0]['id'] : 0;

    // console.log(employee_id, role_id);


    await connection.execute(`Update employee Set role_id = ? Where id = ?`, [role_id, employee_id]);

    console.log(`Updated ${res.user}'role to the database`);

}
connectDatabase();