const select = document.getElementById("select");
const form = document.getElementById("form");
const submit = document.getElementById("submit");

const oldp = document.getElementById("oldpass");
const newp = document.getElementById("newpass");


const sessionID = localStorage.getItem("sessionID");

form.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch("/admin/changeadminpass", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            oldpass: oldp.value,
            newpass: newp.value
        })
    }).then(res => res.json());

    submit.disabled = true;

    if (response[0] === -1) window.location.href = "/admin/login.html";
    if (response[0] === true) window.location.href = "/admin/index.html";
    if (response[0] === false) {
        alert("Wrong password");
        oldp.value = "";
    }


    submit.disabled = false;
}