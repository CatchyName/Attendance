const form = document.getElementById("form");
const pass = document.getElementById("password");
const err = document.getElementById("error");

form.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch("/admin/login", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: pass.value,
        }),
    }).then(res => res.json());

    if (response[0]) {
        localStorage.setItem("sessionID", response[0]);
        window.location = "/admin/index.html";

    } else {
        pass.value = "";
        err.innerHTML = "Wrong password";
    }
}