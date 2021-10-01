const fs = require("fs");
const path = require("path");
const Excel = require("exceljs")
const Centers = require("./Centers");

const EmployeesNumber = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employee.json")));
}

const SetEmployeesNumber = (data) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/Employee.json"), JSON.stringify(data, null, "\t"));
    return;
}

const Employees = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employees.json")));
}

const SetEmployees = (employees) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/Employees.json"), JSON.stringify(employees, null, "\t"));
    return;
}

const AddEmployee = (name, centerName, subcenterName, departmentName) => {

    let centerID = Centers.FindCenter(centerName);
    if (!centerID) {
        centerID = Centers.AddCenter(centerName);
    }

    let subID = Centers.FindSubcenter(centerID, subcenterName);
    if (!subID) {
        subID = Centers.AddSubCenter(centerID, subcenterName);
    }

    let departmentID = Centers.FindDepartment(departmentName);
    if (!departmentID) {
        departmentID = Centers.AddDepartment(departmentName);
    }

    let en = EmployeesNumber();
    en[centerID - 1]++;
    SetEmployeesNumber(en);

    let employeeID = centerID * 10000 + en[centerID - 1];

    let employee = {
        "id": employeeID,
        "uuid": "",
        "center": centerID,
        "subcenter": subID,
        "department": departmentID,
        "name": name,
        "sessions": []
    };

    let employees = Employees();
    employees.push(employee.id);
    SetEmployees(employees);
    fs.copyFileSync(path.resolve(__dirname, "../data/Default.png"), path.resolve(__dirname, "../data/Photos/" + employeeID + ".png"));
    fs.writeFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"), JSON.stringify(employee, null, "\t"));

    return employeeID;
}

const AddEmployees = async (filename) => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.resolve(__dirname, "../data/Uploads/" + filename));

    let ids = [];

    const worksheet = workbook.worksheets[0];

    for (let i = 3; true; i++) {
        const row = worksheet.getRow(i);
        if (!row.getCell(1).value) {
            break;
        }

        const name = row.getCell(2).value;
        const department = row.getCell(17).value;
        const center = row.getCell(23).value;
        const subcenter = row.getCell(22).value;

        ids.push(AddEmployee(name, center, subcenter, department));
    }

    return ids;
}

const GetEmployee = (employeeID) => {
    if (!Employees().includes(parseInt(employeeID))) return false;

    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json")));
}

const ChangeEmployee = (employeeID, employeeData) => {
    if (!Employees().includes(employeeID)) return false;

    fs.writeFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"), JSON.stringify(employeeData, null, "\t"));
}

module.exports = {
    AddEmployee,
    AddEmployees,
    GetEmployee,
    ChangeEmployee,
    EmployeesNumber,
    Employees,
    SetEmployees
}