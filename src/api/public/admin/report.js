const form = document.getElementById("report");
const id = document.getElementById("eID");
const err = document.getElementById("error");

form.onsubmit = async (e) => {
    e.preventDefault();

    let parsedID = parseInt(id.value);

    if (!parsedID) {
        err.innerHTML = "ID can only be an integer.";
        id.value = "";
        return;
    }

    if (parsedID < 10000 || parsedID > 999999 || parsedID < 0) {
        err.innerHTML = "ID cannot exist.";
        id.value = "";
        return;
    }
    err.innerHTML = "";

    id.disabled = true;

    let response = await fetch("/admin/report", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            employeeID: parsedID,
        }),
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    if (response[0]) {
        window.open(response, "_blank").focus();
    } else {
        err.innerHTML = "Employee does not exist!"
    }

    id.value = "";
    id.disabled = false;
    id.focus();
}