const form = document.getElementById("form");
const id = document.getElementById("cID");
const err = document.getElementById("err");

const sessionID = localStorage.getItem("sessionID");


form.onsubmit = async (e) => {
    e.preventDefault();

    let parsedID = parseInt(id.value);

    if (!parsedID) {
        err.innerHTML = "ID can only be an integer.";
        id.value = "";
        return;
    }

    err.innerHTML = "";

    id.disabled = true;

    let response = await fetch("/admin/reports", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            centerID: parsedID
        }),
    }).then(res => res.json());

    console.log(response);

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