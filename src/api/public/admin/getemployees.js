const containter = document.getElementById("employees");
const err = document.getElementById("err");

const sessionID = localStorage.getItem("sessionID");

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

    return response[0];
}

const GetEmployees = async () => {

    let response = await fetch("/admin/getemployees", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    const EmployeesList = response[0];

    let string = "";

    for (let i = 0; i < EmployeesList.length; i++) {
        const EmployeeData = await GetEmployeeData(EmployeesList[i]);
        string += `<p>${EmployeeData.id} : <a href="/admin/employee.html?id=${EmployeeData.id}">${EmployeeData.name}</a><ps>`;
    }

    containter.innerHTML = string;

}

GetEmployees();