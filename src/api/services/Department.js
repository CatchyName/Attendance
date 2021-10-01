const fs = require("fs");
const path = require("path");

const DepartmentName = (departmentID) => {
    return GetDepartments()[departmentID - 1];
}

const GetDepartments = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Departments.json")));
}

const SetDepartments = (data) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/Departments.json"), JSON.stringify(data, null, "\t"));
    return;
}

module.exports = {
    GetDepartments,
    SetDepartments,
    DepartmentName
}