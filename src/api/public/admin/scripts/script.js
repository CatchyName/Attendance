const status = document.getElementById("status");

const GetPresent = async () => {

    let response = await fetch("/admin/present", {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    if (response.code === 0) {
        status.innerHTML = `There are ${response.data} Employees inside`;
    } else if (response.code === -1) window.location = "/admin/login.html";

}

GetPresent();