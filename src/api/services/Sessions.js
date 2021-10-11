const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const Employees = require("./Employees");
const Centers = require("./Centers");

const autopunchouttime = 7200000;

const AddSession = (employeeID, center) => {
    let sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    const employee = Employees.GetEmployee(employeeID);
    const session = {
        employeeID: employeeID,
        employee: employee.name,
        center: center,
        start: Date.now(),
        finish: false,
        forgot: false
    }
    sessions[employeeID] = session;

    schedule.scheduleJob(new Date(session.start + autopunchouttime), function () {
        EndSession(employeeID, true);
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json"), JSON.stringify(sessions, null, "\t"));

    return employeeID;
}

const EndSession = (employeeID, automatic) => {
    if (!FindSession(employeeID)) return false;

    let sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    let daysessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/DaySessions.json")));
    let centersessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/CenterSessions.json")));
    let departmentsessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/DepartmentSessions.json")));
    let gendersessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/GenderSessions.json")));

    let session = sessions[employeeID];
    const employee = Employees.GetEmployee(employeeID);
    delete sessions[employeeID];
    session.finish = Date.now();
    if (automatic) session.forgot = true;
    Employees.AddSession(employeeID, session);

    let now = new Date();

    gendersessions[employee.gender].unshift(session);
    centersessions[employee.center - 1][employee.subcenter - 1].unshift(session);
    departmentsessions[employee.department - 1].unshift(session);

    if (!(now.toLocaleString() in daysessions)) {
        daysessions[now.toLocaleDateString()] = [];
    }

    daysessions[now.toLocaleDateString()].unshift(session);


    fs.writeFileSync(path.resolve(__dirname, "../data/DaySessions.json"), JSON.stringify(daysessions, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/CenterSessions.json"), JSON.stringify(centersessions, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/DepartmentSessions.json"), JSON.stringify(departmentsessions, null, "\t"));
    fs.writeFileSync(path.resolve(__dirname, "../data/GenderSessions.json"), JSON.stringify(gendersessions, null, "\t"));

    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json"), JSON.stringify(sessions, null, "\t"));
    return true;
}

const FindSession = (employeeID) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    const session = sessions[employeeID];
    if (!session) return false;
    else return session;
}


const LoadSessions = () => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    for (let id in sessions) {
        const now = Date.now();
        if (now - sessions[id].start >= autopunchouttime) {
            EndSession(id, true);
        } else {
            schedule.scheduleJob(new Date(sessions[id].start + autopunchouttime), function () {
                EndSession(id, true);
            });
        }
    }
}

const ActiveSessions = () => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    return Object.keys(sessions).length;
}

const DepartmentSessions = (DepartmentID) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/DepartmentSessions.json")));
    return sessions[DepartmentID];
}

const CenterSessions = (CenterID) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/CenterSessions.json")));
    const centersessions = sessions[CenterID - 1]
    let data = [];

    for (let i = 0; i < centersessions.length; i++) {
        let subcenter = centersessions[i];
        for (let j = 0; j < subcenter.length; j++) {
            data.push(subcenter[j]);
        }
    }

    return data;
}

const SubcenterSessions = (CenterID, SubcenterID) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/CenterSessions.json")));
    return sessions[CenterID - 1][SubcenterID - 1];
}

const DaySessions = (day) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/DaySessions.json")));
    return sessions[day];
}

const GenderSessions = (gender) => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/GenderSessions.json")));
    return sessions[gender.toUpperCase()];
}

const ActiveEmployees = () => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    return sessions;
}

module.exports = {
    AddSession,
    EndSession,
    FindSession,
    LoadSessions,
    ActiveSessions,
    ActiveEmployees,
    DepartmentSessions,
    CenterSessions,
    SubcenterSessions,
    DaySessions,
    GenderSessions
}