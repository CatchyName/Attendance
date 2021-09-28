const sha256 = require("sha256");

const Admin = require("./AdminController");
const { Employees, Centers } = require("../services");

let centers = require("../data/Centers.json");
let employees = require("../data/Employees.json");

const Login = password => {
    return Centers.Login(password);
}

const CheckSession = sessionID => {
    return Centers.CheckSession(sessionID);
}

const Terminals = () => {
    return Centers.GetCenters();
}

const Scan = (employeeID, department) => {

    let employee = Employees.GetEmployee(employeeID);

    if (!employee) return false;

    if (employee.sessions.length < 1 || employee.sessions[0].finish) {
        employee.sessions.unshift({
            department: department,
            start: Date.now(),
            finish: false,
        });

        Admin.AddInside();
    } else {
        Admin.RemoveInside();
        employee.sessions[0].finish = Date.now();
    }

    Employees.ChangeEmployee(employeeID, employee);

    return employee;
}

module.exports = {
    Terminals,
    Scan,
    Login,
    CheckSession
};