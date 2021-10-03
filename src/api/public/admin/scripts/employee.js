const form = document.getElementById("form");
const submit = document.getElementById("submit");
const err = document.getElementById("err");
const name = document.getElementById("name");
const idno = document.getElementById("idno");
const sowo = document.getElementById("sowo");
const zoneno = document.getElementById("zoneno");
const zonedeparatment = document.getElementById("zonedepartment");
const contactno = document.getElementById("contactno");
const gender = document.getElementById("gender");
const blood = document.getElementById("blood");
const center = document.getElementById("center");
const subcenter = document.getElementById("subcenter");
const department = document.getElementById("department");

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

const LoadDepartments = async () => {
    department.innerHTML = "";
    const departments = await GetDepartments();
    for (let i = 0; i < departments.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = departments[i];
        department.appendChild(option);
    }
}

LoadSubcenters = async () => {
    subcenter.innerHTML = "";
    const subcenters = await GetSubcenters(center.options[center.selectedIndex].value);
    for (let i = 0; i < subcenters.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = subcenters[i];
        subcenter.appendChild(option);
    }
}

form.onsubmit = async (e) => {
    e.preventDefault();

    submit.disabled = true;

    let response = await fetch("/admin/addemployee", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name.value,
            idno: idno.value,
            sowo: sowo.value,
            zoneno: zoneno.value,
            zonedeparatment: zonedeparatment.value,
            contactno: contactno.value,
            gender: gender.value,
            blood: blood.value,
            center: center.options[center.selectedIndex].text,
            subcenter: subcenter.options[subcenter.selectedIndex].text,
            department: department.options[department.selectedIndex].text
        })
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";

    name.value = "";
    center.value = "";
    subcenter.value = "";
    department.value = "";

    err.innerHTML = "Employee " + response.data.employeeID + " has been added.";

    submit.disabled = false;
}

CheckSession();
LoadCenters();
LoadDepartments();

center.onchange = LoadSubcenters;