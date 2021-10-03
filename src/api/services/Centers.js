const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const sha256 = require("sha256");
const Info = require("./Info");

const EmployeeCenters = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeCenters.json")));
}

const SetEmployeeCenters = (data) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeCenters.json"), JSON.stringify(data, null, "\t"));
    return;
}

const EmployeeDepartments = () => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Employeedepartments.json")));
}

const SetEmployeeDepartments = (data) => {
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeDepartments.json"), JSON.stringify(data, null, "\t"));
    return;
}

let sessions = {};

const Login = (password) => {

    if (sha256(password) !== Info.GetTerminalPassword()) return false;


    const sessionID = uuidv4();
    sessions[sessionID] = Date.now();

    return sessionID;
}

const CheckSession = (sessionID) => {
    const session = sessions[sessionID];

    if (session) return true;
    else return false;
}

const CenterName = (centerID) => {
    const centers = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Centers.json")));
    if (centerID > centers.length) return false;
    else return centers[centerID - 1];
}

const GetCenters = () => {
    const centers = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Centers.json")));
    return centers;
}

const GetCenterNames = () => {
    const centers = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/CenterNames.json")));
    return centers;
}

const GetDepartments = () => {
    const centers = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Departments.json")));
    return centers;
}

const AddCenter = (name) => {
    let centers = GetCenters();
    let centernames = GetCenterNames();
    centers.push(name.toUpperCase());
    const centerID = centers.length;
    centernames[name.toUpperCase()] = centerID;

    let ec = EmployeeCenters();
    ec[name.toUpperCase()] = [];
    SetEmployeeCenters(ec);

    fs.writeFileSync(path.resolve(__dirname, "../data/Centers.json"), JSON.stringify(centers, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/CenterNames.json"), JSON.stringify(centernames, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/Centers/" + centerID + ".json"), JSON.stringify([], null, "\t"));

    return centerID;
}

const Clear = () => {
    let centers = GetCenters();
    for (let i = 0; i < centers.length; i++) {
        fs.unlinkSync(path.resolve(__dirname, "../data/Centers/" + (i + 1) + ".json"));
    }
    fs.writeFileSync(path.resolve(__dirname, "../data/Centers.json"), JSON.stringify([], null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/CenterNames.json"), JSON.stringify({}, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/Departments.json"), JSON.stringify([], null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/Employeecenters.json"), JSON.stringify({}, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeDepartments.json"), JSON.stringify({}, null, "\t"));
    return true;
}

const FindCenter = (name) => {
    const centers = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/CenterNames.json")));
    const centerID = centers[name.toUpperCase()];
    if (centerID) return centerID;
    else return false;
}

const GetSubCenters = (centerID) => {
    const center = CenterName(centerID);
    if (!center) return false;

    const subcenters = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Centers/" + centerID + ".json")));
    if (!subcenters) return false;
    else return subcenters;
}

const SubcenterName = (centerID, subID) => {
    const subcenters = GetSubCenters(centerID);
    if (!subcenters) return false;
    else return subcenters[subID - 1];
}

const FindSubcenter = (centerID, subname) => {
    const subcenters = GetSubCenters(centerID);
    for (let i = 0; i < subcenters.length; i++) {
        if (subcenters[i] === subname.toUpperCase()) return i + 1;
    }
    return false;
}

const AddSubCenter = (centerID, name) => {
    const center = CenterName(centerID);
    if (!center) return false;

    let subcenters = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/Centers/" + centerID + ".json")));
    subcenters.push(name.toUpperCase());
    fs.writeFileSync(path.resolve(__dirname, "../data/Centers/" + centerID + ".json"), JSON.stringify(subcenters, null, "\t"));

    return subcenters.length;
}

const AddDepartment = (departmentName) => {
    const departments = GetDepartments();
    departments.push(departmentName.toUpperCase());
    fs.writeFileSync(path.resolve(__dirname, "../data/Departments.json"), JSON.stringify(departments, null, "\t"));
    return departments.length;
}

const FindDepartment = (departmentName) => {
    const departments = GetDepartments();
    for (let i = 0; i < departments.length; i++) {
        if (departments[i] === departmentName.toUpperCase()) return i + 1;
    }
    return false;
}

const DepartmentName = (departmentID) => {
    const departments = GetDepartments();
    if (!departments) return false;
    else return departments[departmentID - 1];
}

module.exports = {
    Login,
    CheckSession,
    CenterName,
    GetCenters,
    GetSubCenters,
    AddCenter,
    FindCenter,
    AddSubCenter,
    FindSubcenter,
    AddDepartment,
    FindDepartment,
    SubcenterName,
    DepartmentName,
    Clear,
    GetDepartments
}