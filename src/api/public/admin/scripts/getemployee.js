const containter = document.getElementById("employees");
const title = document.getElementById("title");
const center = document.getElementById("center");
const department = document.getElementById("department");
const form = document.getElementById("form");
const err = document.getElementById("err");
const table = document.getElementById("table");
const img = document.getElementById("photo");

const url = new URL(window.location);
const EmployeeID = url.searchParams.get("id");

let EmployeeData;

const LoadEmployee = async () => {
    const data = await GetEmployeeData(EmployeeID);
    if (!data) {
        err.innerHTML = "Employee not found. Redirecting in 5 seconds...";
        window.setTimeout(function () {
            window.location.href = "/admin/employees.html"
        }, 5000);
    }
    EmployeeData = data;

    form.action = "/admin/setphoto/" + data.id;

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
            employeeID: EmployeeID,
        }),
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";

    if (response.code === 0) {
        window.open(response.data, "_blank").focus();
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
            employeeID: EmployeeID
        }),
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";

    if (response.data) {
        window.open(response.data, "_blank").focus();
    } else {
        err.innerHTML = "Something went wrong!";
    }

}

const DeleteEmployee = async () => {

}

CheckSession();
LoadEmployee();
