const table = document.getElementById("table");
const err = document.getElementById("err");

const url = new URL(window.location);
const DepartmentName = url.searchParams.get("department");

let EmployeeData;

const DeleteEmployee = async (employeeID) => {
    console.log(employeeID);
    let response = await fetch("/admin/deleteemployee", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeID: employeeID
        })
    }).then(res => res.json());

    location.reload();
}

const ShowEmployees = async () => {

    err.innerHTML = "Loading employees...";
    const EmployeesData = await GetEmployeesFromDepartment(DepartmentName);

    const CenterNames = await GetCenters();
    const DepartNames = await GetDepartments();
    const SubcenterNames = await GetAllSubcenters();


    for (let i = 0; i < EmployeesData.length; i++) {
        const row = document.createElement("tr");
        const EmployeeData = EmployeesData[i];

        const td0 = document.createElement("td");
        const a = document.createElement("a");
        a.href = `/admin/employee.html?id=${EmployeeData.id}`;
        a.innerHTML = EmployeeData.id;
        td0.appendChild(a);
        row.appendChild(td0);
        const td1 = document.createElement("td");
        td1.innerHTML = EmployeeData.idno;
        row.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerHTML = EmployeeData.name;
        row.appendChild(td2);
        const td3 = document.createElement("td");
        td3.innerHTML = EmployeeData.gender;
        row.appendChild(td3);
        const td4 = document.createElement("td");
        td4.innerHTML = CenterNames[EmployeeData.center - 1];
        row.appendChild(td4);
        const td5 = document.createElement("td");
        td5.innerHTML = SubcenterNames[EmployeeData.center - 1][EmployeeData.subcenter - 1];
        row.appendChild(td5);
        const td6 = document.createElement("td");
        td6.innerHTML = DepartNames[EmployeeData.department - 1];
        row.appendChild(td6);
        const td7 = document.createElement("td");
        td7.innerHTML = EmployeeData.contactno;
        row.appendChild(td7);
        const td8 = document.createElement("td");
        td8.innerHTML = EmployeeData.zoneno;
        row.appendChild(td8);
        const td9 = document.createElement("td");
        td9.innerHTML = EmployeeData.zonedepartment;
        row.appendChild(td9);
        const td10 = document.createElement("td");
        td10.innerHTML = EmployeeData.sowo;
        row.appendChild(td10);
        const td11 = document.createElement("td");
        td11.innerHTML = EmployeeData.blood;
        row.appendChild(td11);

        const td12 = document.createElement("td");
        const del = document.createElement("button");
        del.innerHTML = "Delete";
        del.onclick = function () {
            DeleteEmployee(EmployeeData.id);
        }
        td12.appendChild(del);
        row.appendChild(td12);

        table.appendChild(row);

    }

    if (EmployeesData.length === 0) {
        err.innerHTML = "No Employees";
    } else {
        err.innerHTML = "";
    }

}

CheckSession();
ShowEmployees();