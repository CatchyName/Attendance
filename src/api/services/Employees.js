const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Excel = require("exceljs")
const Centers = require("./Centers");

const EmployeeCenters = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeCenters.json")));
}

const SetEmployeeCenters = (data) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeCenters.json"), JSON.stringify(data, null, "\t"));
    return;
}

const Employees = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employees.json")));
}

const SetEmployees = (employees) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/Employees.json"), JSON.stringify(employees, null, "\t"));
    return;
}

const AddEmployee = (name, centerName, subcenterName, departmentName, idno, sowo, gender, zoneno, zonedep, contactno, blood) => {

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



    // ID Generation modified to refill deleted IDs

    let ec = EmployeeCenters();
    let employeeID = 0;
    let refill = false;

    for (let i = 0; i < ec[centerName.toUpperCase()].length; i++) {
        if (ec[centerName.toUpperCase()][i] === 0) {
            ec[centerName.toUpperCase()][i] = centerID * 10000 + i + 1;
            employeeID = centerID * 10000 + i + 1;
            refill = true;
            SetEmployeeCenters(ec);
            break;
        }
    }

    if (!refill) {
        employeeID = centerID * 10000 + ec[centerName.toUpperCase()].length + 1;
        ec[centerName.toUpperCase()].push(employeeID);
        SetEmployeeCenters(ec);
    }

    let employee = {
        "id": employeeID,
        "idno": idno,
        "sowo": sowo,
        "gender": gender,
        "zoneno": zoneno,
        "zonedeparatment": zonedep,
        "contactno": contactno,
        "blood": blood,
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
    fs.copyFileSync(path.resolve(__dirname, "../data/Default.png"), path.resolve(__dirname, "../public/photos/" + employeeID + ".png"));
    fs.writeFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"), JSON.stringify(employee, null, "\t"));

    return employeeID;
}

const AddEmployees = async (filename) => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.resolve(__dirname, "../data/Uploads/" + filename));

    let ids = [];

    const worksheet = workbook.worksheets[0];

    for (let i = 2; true; i++) {
        const row = worksheet.getRow(i);

        if (!row.getCell(1).value) {
            break;
        }

        if (!row.getCell(3).value) {
            continue;
        }

        const idno = row.getCell(1).value;
        const name = row.getCell(2).value;
        const sowo = row.getCell(3).value;
        const gender = row.getCell(4).value;
        const contactno = row.getCell(8).value;
        const blood = row.getCell(16).value;
        const department = row.getCell(17).value;
        const zoneno = row.getCell(19).value;
        const zonedeparatment = row.getCell(20).value;
        const center = row.getCell(23).value;
        const subcenter = row.getCell(22).value;

        ids.push(AddEmployee(name, center, subcenter, department, idno, sowo, gender, zoneno, zonedeparatment, contactno, blood));
    }

    return ids;
}

const DeleteEmployee = (employeeID) => {
    let centername = Centers.CenterName(Math.Floor(employeeID / 10000));

    // Remove Emoployee from the center list
    let ec = EmployeeCenters();
    ec[centername.toUpperCase()][employeeID % 10000 - 1] = 0;
    SetEmployeeCenters(ec);


    // Remove Employee from all employees list
    let emps = GetEmployees();
    for (let i = 0; i < emps.length; i++) {
        if (emps[i] === employeeID) {
            emps.splice(i, 1);
            break;
        }
    }
    SetEmployees(emps);

    // Delete employee file
    fs.unlinkSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"));
    return true;
}

const AddSession = (employeeID, session) => {
    let employee = GetEmployee(employeeID);
    employee.sessions.unshift(session);
    ChangeEmployee(employeeID, employee);
    return true;
}

const GetEmployee = (employeeID) => {

    if (!Employees().includes(parseInt(employeeID))) return false;

    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json")));
}

const ChangeEmployee = (employeeID, employeeData) => {
    if (!Employees().includes(employeeID)) return false;

    fs.writeFileSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"), JSON.stringify(employeeData, null, "\t"));
}

const Clear = () => {
    const employees = Employees();

    for (let i = 0; i < employees.length; i++) {
        fs.unlinkSync(path.resolve(__dirname, "../data/Employees/" + employeeID + ".json"));
        fs.unlinkSync(path.resolve(__dirname, "../public/photos/" + employeeID + ".png"));
    }

    SetEmployees([]);
}

module.exports = {
    AddEmployee,
    AddEmployees,
    DeleteEmployee,
    GetEmployee,
    ChangeEmployee,
    Employees,
    SetEmployees,
    AddSession,
    EmployeeCenters,
    SetEmployeeCenters,
    Clear
}