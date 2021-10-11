const form = document.getElementById("form");
const err = document.getElementById("err");
const department = document.getElementById("department");

const LoadDepartments = async () => {
    department.innerHTML = "";
    const departments = await GetDepartments();
    for (let i = 0; i < departments.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = departments[i];
        department.appendChild(option);
    }
    UpdateData();
}

const UpdateData = async () => {

    let response = await fetch("/admin/departmentsessions", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            departmentID: department.options[department.selectedIndex].value
        }),
    }).then(res => res.json());


    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code === 0) {
        table.innerHTML = ""
        const tr = document.createElement("tr");

        const e = document.createElement("th");
        const c = document.createElement("th");
        const t1 = document.createElement("th");
        const t2 = document.createElement("th");

        e.innerHTML = "Employee ID";
        c.innerHTML = "Center";
        t1.innerHTML = "Entry time";
        t2.innerHTML = "Exit time";


        tr.appendChild(e);
        tr.appendChild(c);
        tr.appendChild(t1);
        tr.appendChild(t2);
        table.appendChild(tr);

        for (employeeID in response.data) {
            const session = response.data[employeeID];

            const tr = document.createElement("tr");

            const e = document.createElement("td");
            const c = document.createElement("td");
            const t1 = document.createElement("td");
            const t2 = document.createElement("td");


            const a = document.createElement("a");
            a.href = `/admin/employee.html?id=${session.employeeID}`;
            a.innerHTML = session.employee;
            e.appendChild(a);
            c.innerHTML = `${session.center}`;
            const time1 = new Date(session.start);
            const time2 = new Date(session.finish);
            t1.innerHTML = `${time1.toLocaleString()}`;
            t2.innerHTML = `${time2.toLocaleString()}`;

            tr.appendChild(e);
            tr.appendChild(c);
            tr.appendChild(t1);
            tr.appendChild(t2);
            table.appendChild(tr);
        }
    }

}

const DepartmentReport = async () => {
    let response = await fetch("/admin/departmentreport", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            departmentID: department.options[department.selectedIndex].value
        }),
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code === 0) window.location.href = response.data;
}

department.onchange = UpdateData;
LoadDepartments();