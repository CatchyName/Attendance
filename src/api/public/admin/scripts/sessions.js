const status = document.getElementById("status");
const table = document.getElementById("table")

const GetActiveEmployees = async () => {

    let response = await fetch("/admin/sessions", {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());


    if (response.code === -1) window.location = "/admin/login.html";
    if (response.code === 0) {
        const tr = document.createElement("tr");

        const e = document.createElement("th");
        const c = document.createElement("th");
        const t1 = document.createElement("th");

        e.innerHTML = "Employee ID";
        c.innerHTML = "Center";
        t1.innerHTML = "Entry time";

        tr.appendChild(e);
        tr.appendChild(c);
        tr.appendChild(t1);
        table.appendChild(tr);

        for (employeeID in response.data) {
            const session = response.data[employeeID];

            const tr = document.createElement("tr");

            const e = document.createElement("td");
            const c = document.createElement("td");
            const t1 = document.createElement("td");


            const a = document.createElement("a");
            a.href = `/admin/employee.html?id=${employeeID}`;
            a.innerHTML = employeeID;
            e.appendChild(a);
            c.innerHTML = `${session.center}`;
            const time1 = new Date(session.start);
            t1.innerHTML = `${time1.toLocaleString()}`;

            tr.appendChild(e);
            tr.appendChild(c);
            tr.appendChild(t1);
            table.appendChild(tr);
        }
    }
}

const GetPresent = async () => {

    let response = await fetch("/admin/present", {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    if (response.code === 0) {
        status.innerHTML = `There are ${response.data} Employees inside`;
    } else if (response.code === -1) window.location = "/admin/login.html";

}

GetPresent();
GetActiveEmployees();