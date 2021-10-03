const form = document.getElementById("form");
const select = document.getElementById("select");
const subcenter = document.getElementById("subcenter");
const err = document.getElementById("err");

const Load = async () => {
    const centers = await GetCenters();

    for (let i = 0; i < centers.length; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = centers[i];
        select.appendChild(option);
    }
}

form.onsubmit = async (e) => {
    e.preventDefault();

    let response = await fetch("/admin/addsubcenter", {
        mode: 'cors',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            center: parseInt(select.options[select.selectedIndex].value),
            subname: subcenter.value
        })
    }).then(res => res.json());

    if (response.code === -1) {
        window.location = "/admin/login.html";
        return
    }
    if (response.code === 1) {
        subcenter.value = "";
        err.innerHTML = response.msg;
    }
    else if (response.code === 0) {
        subcenter.value = "";
        err.innerHTML = response.msg;
    }

}

CheckSession();
Load();