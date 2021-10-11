const sha256 = require("sha256");

const Admin = require("./AdminController");
const { Employees, Centers, Sessions } = require("../services");

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

const Scan = (employeeID, center) => {

    let employee = Employees.GetEmployee(employeeID);

    if (!employee) return { code: -5, msg: "Employee not found" };

    const session = Sessions.FindSession(employeeID);

    if (!session) {
        Sessions.AddSession(employeeID, center);
        return { code: 0, msg: "Employee Entered the department", data: employee };
    } else {
        Sessions.EndSession(employeeID, false);
        return { code: 0, msg: "Employee Exited the department", data: employee };
    }
}

module.exports = {
    Terminals,
    Scan,
    Login,
    CheckSession
};