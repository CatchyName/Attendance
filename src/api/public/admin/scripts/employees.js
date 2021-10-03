const select = document.getElementById("select");
const form = document.getElementById("form");
const submit = document.getElementById("submit");

const sessionID = localStorage.getItem("sessionID");

const getfiles = async () => {
    let response = await fetch("/admin/uploadedFiles", {
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

    for (let i = 0; i < response.length; i++) {
        const option = document.createElement("option");
        option.value = option.innerHTML = response[i];
        select.appendChild(option);
    }

}

form.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch("/admin/addemployees", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            filename: select.options[select.selectedIndex].value
        })
    }).then(res => res.json());

    submit.disabled = true;

    if (response[0] === 0) window.location.href = "/admin/";

    submit.disabled = false;
}

getfiles();