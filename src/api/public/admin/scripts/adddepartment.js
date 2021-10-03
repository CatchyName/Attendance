const form = document.getElementById("form");
const department = document.getElementById("department");
const err = document.getElementById("err");

form.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch("/admin/adddepartment", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            department: department.value,
        })
    }).then(res => res.json());

    if (response.code === -1) {
        window.location = "/admin/login.html"
    } else if (response.code === 0) {
        department.value = "";
        err.innerHTML = response.msg;
    } else {
        department.value = "";
        err.innerHTML = response.msg;
    }
}

CheckSession();