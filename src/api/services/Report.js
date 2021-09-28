const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const exceljs = require("exceljs");
const Centers = require("./Centers.js");
const Employees = require("./Employees");

const EmployeeReport = async (employeeID) => {
    let employee = Employees.GetEmployee(employeeID);

    if (!employee) {
        return false;
    }

    const workbook = new exceljs.Workbook();
    workbook.creator = "Attendance Server";

    const sheet = workbook.addWorksheet(employeeID.toString(), { properties: { tabColor: { rgb: 'FFFFFF' } } });

    sheet.addRow([
        employee.name,
        Centers.CenterName(employee.center),
        Centers.SubcenterName(employee.center, employee.subcenter),
        Centers.DepartmentName(employee.department)
    ]);

    sheet.addRow([
        "Day",
        "Center",
        "Start",
        "Finish"
    ]);

    employee.sessions.forEach(s => {

        let startdate = new Date(s.start);
        let enddate = new Date(s.finish);

        sheet.addRow([
            startdate.toDateString(),
            s.department,
            startdate.toLocaleTimeString(),
            enddate.toLocaleTimeString()
        ]);
    });

    const id = uuidv4();
    await workbook.xlsx.writeFile(path.resolve(__dirname, "../public/reports/" + id + ".xlsx"));
    return "/reports/" + id + ".xlsx";
};

const CenterReport = async (centerID) => {
    let center = Centers.CenterName(centerID);

    if (!center) {
        return false;
    }

    const workbook = new exceljs.Workbook();
    workbook.creator = "Attendance Server";
    const en = Employees.EmployeesNumber();
    const emps = en[centerID - 1];


    for (let i = 0; i < emps; i++) {

        let employee = Employees.GetEmployee(centerID * 10000 + i + 1);
        const employeeID = employee.id;

        if (!employee) {
            continue;
        }

        const sheet = workbook.addWorksheet(employeeID.toString(), { properties: { tabColor: { rgb: 'FFFFFF' } } });

        sheet.addRow([
            employee.name,
            Centers.CenterName(employee.center),
            Centers.SubcenterName(employee.center, employee.subcenter),
            Centers.DepartmentName(employee.department)
        ]);

        sheet.addRow([
            "Day",
            "Center",
            "Start",
            "Finish"
        ]);

        employee.sessions.forEach(s => {

            let startdate = new Date(s.start);
            let enddate = new Date(s.finish);

            sheet.addRow([
                startdate.toDateString(),
                s.department,
                startdate.toLocaleTimeString(),
                enddate.toLocaleTimeString()
            ]);
        });
    }

    const id = uuidv4();
    await workbook.xlsx.writeFile(path.resolve(__dirname, "../public/reports/" + center + id + ".xlsx"));
    return "/reports/" + center + id + ".xlsx";
}



module.exports = {
    EmployeeReport,
    CenterReport,
};