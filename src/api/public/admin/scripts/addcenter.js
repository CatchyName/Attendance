const form = document.getElementById("form");
const center = document.getElementById("center");
const err = document.getElementById("err");

form.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch("/admin/addcenter", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            center: center.value,
        })
    }).then(res => res.json());

    console.log(response);

    if (response.code === -1) {
        window.location = "/admin/login.html"
    } else if (response.code === 0) {
        center.value = "";
        err.innerHTML = response.msg;
    } else {
        center.value = "";
        err.innerHTML = response.msg;
    }
}