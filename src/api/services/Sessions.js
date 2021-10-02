const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const Employees = require("./Employees");
const Centers = require("./Centers");

const AddSession = (employeeID, centerID) => {
    let sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    const session = {
        center: Centers.CenterName(centerID),
        start: Date.now(),
        finish: false,
        forgot: false
    }
    sessions[employeeID] = session;

    schedule.scheduleJob(new Date(session.start + 7200000), function () {
        EndSession(employeeID, true);
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json"), JSON.stringify(sessions, null, "\t"));

    return employeeID;
}

const EndSession = (employeeID, automatic) => {
    if (!FindSession(employeeID)) return false;

    let sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));

    let session = sessions[employeeID];
    delete sessions[employeeID];
    session.finish = Date.now();
    if (automatic) session.forgot = true;
    Employees.AddSession(employeeID, session);

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
        if (now - sessions[id].start >= 7200000) {
            EndSession(id, true);
        } else {
            schedule.scheduleJob(new Date(session.start + 7200000), function () {
                EndSession(id, true);
            });
        }
    }
}

const ActiveSessions = () => {
    const sessions = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/EmployeeSessions.json")));
    return Object.keys(sessions).length;
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
    ActiveEmployees
}