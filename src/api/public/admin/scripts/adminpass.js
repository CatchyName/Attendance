const select = document.getElementById("select");
const form = document.getElementById("form");
const submit = document.getElementById("submit");
const err = document.getElementById("err");

const oldp = document.getElementById("oldpass");
const newp = document.getElementById("newpass");


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
            oldpass: oldp.value,
            newpass: newp.value
        })
    }).then(res => res.json());

    submit.disabled = true;

    if (response.code === -1) window.location.href = "/admin/login.html";
    if (response.code === 1) {
        oldpass.value = "";
        newpass.value = "";
        err.innerHTML = response.msg;
    }

    if (response.code === 0) window.location.href = "/admin/index.html";


    submit.disabled = false;
}

CheckSession();