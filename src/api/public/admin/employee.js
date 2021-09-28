const form = document.getElementById("form");
const submit = document.getElementById("submit");
const err = document.getElementById("err");
const name = document.getElementById("name");
const center = document.getElementById("center");
const subcenter = document.getElementById("subcenter");
const department = document.getElementById("department");

const sessionID = localStorage.getItem("sessionID");

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
            sessionID: sessionID,
            name: name.value,
            center: center.value,
            subcenter: subcenter.value,
            department: department.value
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    name.value = "";
    center.value = "";
    subcenter.value = "";
    department.value = "";

    err.innerHTML = "Employee " + response[0] + " has been added.";

    submit.disabled = false;
}
