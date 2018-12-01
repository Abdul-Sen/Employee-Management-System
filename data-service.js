const Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'user', 'password', { //TODO: Write your DB details here
    host: 'host',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});


var Employee = sequelize.define('Employee',{
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
})

var Department = sequelize.define('Department',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING,
})

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function()
{
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=>{
            resolve("sync successful with database");
        }).catch(()=>{
            reject("Bleep bloop failed to sync with database!");
        })
    });
}

module.exports.getAllEmployees = function()
{
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                // no condition
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data for employees ${err}`);
        })
        });
}

module.exports.getEmployeesByStatus = (ui_status)=> {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: ui_status
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data by status ${err}`);
        })
        });
}
module.exports.getEmployeesByDepartment = (ui_department)=> {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: ui_department
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data by department number ${err}`);
        })
        });
}


module.exports.getEmployeesByManager = (ui_managerNum)=> {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: ui_managerNum
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data by manager number ${err}`);
        })
        });
}
    


module.exports.getEmployeeByNum = function(empNum) {
    return new Promise(function (resolve, reject) {
        Employee.findOne({
            where: {
                employeeNum: empNum
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data by employee number `);
        })
        });
}
module.exports.getDepartments = function() 
{
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                // no condition
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data for departments ${err}`);
        })
        });
}

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if(employeeData[prop] == '')
                employeeData[prop] = null;
        }

        Employee.create(employeeData).then(() => {
            resolve();
        }).catch((err)=>{
            reject("unable to create employee");
        });

    });
};


module.exports.updateEmployee = function(employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for (var prop in employeeData) {
        if(employeeData[prop] == '')
            employeeData[prop] = null;
    }

    return new Promise(function (resolve, reject) {
        Employee.update(employeeData,
        {
            where:
            {
                employeeNum: employeeData.employeeNum
            }
        }).then(()=>{
            resolve("successfully updated current employee");
        }).catch(()=>{
            reject(`failed to update current employee`);
        })
        });
}
module.exports.getManagers = function()
{
    return new Promise(function (resolve, reject) {
        reject();
        });
}

module.exports.addDepartment = function(departmentData)
{

    for (var prop in departmentData) {
        if(departmentData[prop] == '')
        departmentData[prop] = null;
    }
    return new Promise((resolve,reject)=>{
        Department.create(departmentData).then(()=>{
            resolve(`Successfully created department`);
        }).catch(()=>{
            reject(`failed to create new department`);
        })
    })
}

module.exports.updateDepartment = function(departmentData)
{
    for (var prop in departmentData) {
        if(departmentData[prop] == '')
        departmentData[prop] = null;
    }
    return new Promise((resolve,reject)=>{
        Department.update(departmentData,{
            where:{
                departmentId : departmentData.departmentId
            }
        }).then(()=>{
            resolve(`updated department successfully`);
        }).catch(()=>{
            reject(`failed to update department successfully`);
        })
    })
}

module.exports.getDepartmentById = function(id)
{
    return new Promise(function (resolve, reject) {
        Department.findOne({
            where: {
                departmentId : id
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(`failed to get data by department ID number ${err}`);
        })
        });
}

module.exports.deleteDepartmentById = function(id)
{
    return new Promise((resolve,reject)=>{
        Department.destroy({
            where: {
                departmentId: id
            }
        }).then(()=>{
            resolve(`ANNIHILATED DEPARTMENT BY ID >:D`);
        }).catch(()=>{
            reject(`Failed to destroy department by ID`);
        })
    })
}

module.exports.deleteEmployeeByNum = function(empNum)
{
    return new Promise((resolve,reject)=>{
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(()=>{
            resolve(`deleted employee at index ${empNum}`);
        }).catch(()=>{
            reject(`Failed to destroy employee by ID`);
        })
    })

}