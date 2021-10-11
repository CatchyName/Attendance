const center = document.getElementById("center");
const subcenter = document.getElementById("subcenter");
const err = document.getElementById("err");

let data;

const LoadCenters = async () => {
    center.innerHTML = "";
    const centers = await GetCenters();
    for (let i = 0; i < centers.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = centers[i];
        center.appendChild(option);
    }
    LoadSubcenters();
}

let LoadSubcenters = async () => {
    subcenter.innerHTML = "";
    const subcenters = await GetSubcenters(center.options[center.selectedIndex].value);
    for (let i = 0; i < subcenters.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = subcenters[i];
        subcenter.appendChild(option);
    }
    UpdateData();
}

let UpdateData = async () => {

    let response = await fetch("/admin/subcentersessions", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            centerID: center.options[center.selectedIndex].value,
            subcenterID: subcenter.options[subcenter.selectedIndex].value
        }),
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code === 0) {
        data = response.data;
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

center.onchange = LoadSubcenters;
subcenter.onchange = UpdateData;
LoadCenters();