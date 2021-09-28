const { Report, Admin, Barcode, Employees, Card } = require("../services");

let inside = Admin.GetInside();

const AddInside = () => {
    inside++;
    Admin.SetInside(inside);
}

const RemoveInside = () => {
    inside--;
    Admin.SetInside(inside);
}

const GetInside = () => {
    inside = Admin.GetInside(inside);
    return inside;
}

const Login = (password) => {
    return Admin.Login(password);
}

const CheckSession = (sessionID) => {
    return Admin.CheckSession(sessionID);
}

const ChangeTerminalPassword = (oldpass, newpass) => {
    return Admin.ChangeTerminalPassword(oldpass, newpass);
}

const ChangeAdminPassword = (oldpass, newpass) => {
    return Admin.ChangeAdminPassword(oldpass, newpass);
}

const EmployeeReport = async (employeeID) => {
    return await Report.EmployeeReport(employeeID);
}

const CenterReport = async (centerID) => {
    return await Report.CenterReport(centerID);
}

const GenerateBarcode = (employeeID) => {
    return Barcode.GenerateBarcode(employeeID);
}

const GenerateBarcodes = () => {
    let list = [];

    const employees = Employees.Employees();
    employees.forEach(v => {
        list.push(Barcode.GenerateBarcode(v));
    });

    return list;
}

const GenerateCard = async (employeeID) => {
    return await sCard.CreateID(employeeID);
}

const GenerateCards = async () => {
    let list = [];

    const employees = Employees.Employees();
    for (let i = 0; i < employees.length; i++) {
        list.push(await Card.CreateID(employees[i]));
    }

    return list;
}

const AddEmployees = async filename => {
    return Employees.AddEmployees(filename);
}

const AddEmployee = (name, center, subcenter, department) => {
    return Employees.AddEmployee(name, center, subcenter, department);
}

module.exports = {
    AddInside,
    RemoveInside,
    GetInside,
    EmployeeReport,
    CenterReport,
    Login,
    ChangeTerminalPassword,
    ChangeAdminPassword,
    CheckSession,
    GenerateBarcode,
    GenerateBarcodes,
    GenerateCard,
    GenerateCards,
    AddEmployees,
    AddEmployee
}