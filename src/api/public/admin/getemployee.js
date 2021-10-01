const containter = document.getElementById("employees");
const title = document.getElementById("title");
const center = document.getElementById("center");
const department = document.getElementById("department");
const err = document.getElementById("err");
const table = document.getElementById("table");
const img = document.getElementById("photo");

const sessionID = localStorage.getItem("sessionID");

const url = new URL(window.location);
const EmployeeID = url.searchParams.get("id");

let EmployeeData;

const GetEmployeeData = async (employeeID) => {
    let response = await fetch("/admin/getemployeedata", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            employeeID: employeeID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";
    if (response[0] === false) {
        err.innerHTML = "Employee not found. Redirecting in 5 seconds...";
        window.setTimeout(function () {
            window.location.href = "/admin/employees.html"
        }, 5000);
        return false;
    }

    return response[0];
}

const GetCenterName = async (centerID) => {
    let response = await fetch("/admin/getcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            centerID: centerID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    return response[0];
}

const GetSubcenterName = async (centerID, subcenterID) => {
    let response = await fetch("/admin/getsubcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            centerID: centerID,
            subcenterID, subcenterID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    return response[0];
}

const GetDepartmentName = async (departmentID) => {
    let response = await fetch("/admin/getdepartment", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            departmentID, departmentID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    return response[0];
}

const LoadEmployee = async () => {
    const data = await GetEmployeeData(EmployeeID);
    if (!data) return false;
    EmployeeData = data;

    title.innerHTML = `${data.name} ${data.id}`;
    center.innerHTML = `Development Center : ${await GetSubcenterName(data.center, data.subcenter)} (${await GetCenterName(data.center)})`;
    department.innerHTML = `Department : ${await GetDepartmentName(data.department)}`;
    img.src = "/photos/" + EmployeeData.id + ".png";

    const tr = document.createElement("tr");

    const c = document.createElement("th");
    const t1 = document.createElement("th");
    const t2 = document.createElement("th");

    c.innerHTML = "Center";
    t1.innerHTML = "Entry time";
    t2.innerHTML = "Exit time";

    tr.appendChild(c);
    tr.appendChild(t1);
    tr.appendChild(t2);
    table.appendChild(tr);

    for (let i = 0; i < data.sessions.length; i++) {

        const session = data.sessions[i];
        const tr = document.createElement("tr");

        const c = document.createElement("td");
        const t1 = document.createElement("td");
        const t2 = document.createElement("td");

        c.innerHTML = `${session.center}`;
        const time1 = new Date(session.start);
        t1.innerHTML = `${time1.toLocaleString()}`;
        const time2 = new Date(session.finish);
        t2.innerHTML = `${time2.toLocaleString()}`;

        tr.appendChild(c);
        tr.appendChild(t1);
        tr.appendChild(t2);
        table.appendChild(tr);
    }
}

const GetReport = async () => {
    let response = await fetch("/admin/report", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID, sessionID,
            employeeID: EmployeeID,
        }),
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    if (response[0]) {
        window.open(response, "_blank").focus();
    } else {
        err.innerHTML = "Something went wrong!";
    }
}

const GetCard = async () => {
    let response = await fetch("/admin/card", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID, sessionID,
            employeeID: EmployeeID,
        }),
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    if (response[0]) {
        window.open(response[0], "_blank").focus();
    } else {
        err.innerHTML = "Something went wrong!";
    }

}

const DeleteEmployee = async () => {

}

LoadEmployee();
