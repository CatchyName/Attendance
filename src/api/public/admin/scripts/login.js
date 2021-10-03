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

    if (response.code === 0) window.location = "/admin/";
    if (response.code === -1) {
        err.innerHTML = response.msg;
        pass.value = "";
    }

}