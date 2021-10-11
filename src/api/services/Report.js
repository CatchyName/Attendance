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

    const sheet = workbook.addWorksheet(employee.name.toString(), { properties: { tabColor: { rgb: 'FFFFFF' } } });

    sheet.properties.defaultColWidth = 25;

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

        row = sheet.addRow([
            startdate.toDateString(),
            s.center,
            startdate.toLocaleTimeString(),
            enddate.toLocaleTimeString()
        ]);

        if (s.forgot === true) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff0000' }
            }
        }


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
    const en = Employees.EmployeeCenters();
    const emps = en[center];


    for (let i = 0; i < emps.length; i++) {

        let employee = Employees.GetEmployee(emps[i]);
        const employeeID = employee.id;

        if (!employee) {
            continue;
        }

        const sheet = workbook.addWorksheet(employee.name.toString(), { properties: { tabColor: { rgb: 'FFFFFF' } } });

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

            row = sheet.addRow([
                startdate.toDateString(),
                s.center,
                startdate.toLocaleTimeString(),
                enddate.toLocaleTimeString()
            ]);

            if (s.forgot === true) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'ff0000' }
                }
            }

        });
    }

    const id = uuidv4();
    await workbook.xlsx.writeFile(path.resolve(__dirname, "../public/reports/" + center + id + ".xlsx"));
    return "/reports/" + center + id + ".xlsx";
}

const SubcenterReport = async (centerID, subcenterID) => {

}

const DepartmentReport = async (departmentID) => {
    let department = Centers.DepartmentName(departmentID);

    if (!department) {
        return false;
    }

    const workbook = new exceljs.Workbook();
    workbook.creator = "Attendance Server";
    const en = Employees.EmployeeDepartments();
    const emps = en[department];


    for (let i = 0; i < emps.length; i++) {

        let employee = Employees.GetEmployee(emps[i]);
        const employeeID = employee.id;

        if (!employee) {
            continue;
        }

        const sheet = workbook.addWorksheet(employee.name.toString(), { properties: { tabColor: { rgb: 'FFFFFF' } } });

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

            row = sheet.addRow([
                startdate.toDateString(),
                s.center,
                startdate.toLocaleTimeString(),
                enddate.toLocaleTimeString()
            ]);

            if (s.forgot === true) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'ff0000' }
                }
            }

        });
    }

    const id = uuidv4();
    await workbook.xlsx.writeFile(path.resolve(__dirname, "../public/reports/" + department + id + ".xlsx"));
    return "/reports/" + department + id + ".xlsx";
}

module.exports = {
    EmployeeReport,
    CenterReport,
    SubcenterReport,
    DepartmentReport,
};