const inquirer = require('inquirer')
const mysql = require('mysql2')
const db =  mysql.createConnection('mysql://root:rootroot@localhost:3306/employeeCMS_db')

// * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

const question = () => {


inquirer.prompt([{
  message: 'what would you like to do?',
  type: 'list',
  name: 'answer',
  choices: ['Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles', 'View Employees', 'Update Employee', 'Nothing, I am done']
}])
.then(initAnswer => {
  // console.log(initAnswer)
  switch(initAnswer.answer) {
    case 'Add Department': 
    addDepartment()
    break
    case 'Add Role': 
    addRole()
    break
    case 'Add Employee':
    addEmployee()
    break
    case 'Update Employee':
    updateEmployee()
    break
    case 'View Departments':
    viewDepartments()
    break
    case 'View Roles': 
    viewRoles()
    break
    case 'View Employees': 
    viewEmployees()
    break
    case 'Nothing, I am done':
    console.log('Have a nice day!')
    break

  }
})

}

const addDepartment = () => {
  inquirer.prompt([{
    name: 'name',
    message: 'what is the name of the department you would like to add?',
    type: 'input'
  }])
  .then(departmentName=> {
    console.log(departmentName)

    
    
    db.query('INSERT INTO departments SET ?', departmentName, err=> {
      if(err) {
        console.log(err)
      } 
    })
    question()
  })
}

const addRole = () => {
  inquirer.prompt([{
    name: 'title',
    message: 'what is the name of the role you would like to add?',
    type: 'input'
  },
  {
    name: 'salary',
    message: 'what is the salary of the role you would like to add?',
    type: 'input'
  }, 
  {
    name: 'department_id',
    message: 'what is the id of the department for this role?',
    type: 'input'
  }
  ])
  .then(role=> {
    console.log(role)
    db.query('INSERT INTO roles SET ?', role, err=> {
      if(err){
        console.log(err)
      }
    })
    console.log(
      'role added!'
    )
    question()
  })
}

const addEmployee = () => {
  inquirer.prompt([{
    name: 'first_name',
    message: 'what is the first name of the employee you would like to add?',
    type: 'input'
  },
  {
    name: 'last_name',
    message: 'what is the last name of the employee you would like to add?',
    type: 'input'
  }, 
  {
    name: 'role_id',
    message: 'what is the id of the role of the employee?',
    type: 'input'
  },
  {
    name: 'managerBoolean',
    message: 'is the employee a manager?',
    type: 'list',
    choices: ['yes', 'no']
  }
  ])
  .then(employee=> {
    if(employee.managerBoolean === 'yes') {
      
      delete employee.managerBoolean
      db.query('INSERT INTO employees SET ?', employee, err=> {
        if (err) {console.log(err)}
      })
      console.log('manager added!')
      question()

    } else if (employee.managerBoolean === 'no') {
      inquirer.prompt([{
        name: 'manager_id',
        type: 'input',
        message: 'what is the id of the manager of this employee?'
      }])
      .then(subordinate=> {
        delete employee.managerBoolean
        let newEmployee = {
          ...employee,
          manager_id: subordinate.manager_id
        }

        db.query('INSERT INTO employees SET ?', newEmployee, err=> {
          if(err) {
            console.log(err)
          }
        })
        console.log('employee added!')
        question()
      })

    }
  })
}

const updateEmployee = () => {
  inquirer.prompt([
    {
    message: 'what is the id of the employee you would like to update?',
    type: 'input',
    name: 'id',
    },
    {
      message: 'what should the first name of the employee be?',
      type: 'input',
      name: 'first_name'
    },
    {
      message: 'what shouuld the last name of the employee be?',
      type: 'input',
      name: 'last_name'
    },
    {
      message: 'what should the role id be for the employee?',
      type: 'input',
      name: 'role_id'
    },
    {
      message: 'what should the manager id be for the employee?',
      type: 'input',
      name: 'manager_id'
    }
])
.then(updatedEmployee => {
  db.query(`UPDATE employees SET ? WHERE id =${updatedEmployee.id}`, updatedEmployee, err => {
    console.log(err)
  })
  console.log('employee updated!')
  question()
})

}

const viewDepartments = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    if(err) {
      console.log(err)
    }
    console.table(departments)
    question()
  })
}

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, roles) => {
    if(err) {
      console.log(err)
    }
    console.table(roles)
    question()
  })
}

const viewEmployees = () => {
  db.query('SELECT * FROM employees', (err, employees) => {
    if(err) {
      console.log(err)
    }
    console.table(employees)
    question()
  })
}




question()