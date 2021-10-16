const content = document.getElementById("content");

const sessionID = localStorage.getItem("sessionID");

const GetCards = async () => {
    let response = await fetch("/admin/cards", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";

    for (let i = 0; i < response.data.length; i++) {
        console.log(1);
        content.innerHTML += "<img class='card' src=" + response.data[i] + ">";
    }

}

const Download = async () => {
    let response = await fetch("/admin/getcards", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    if (response.code === -1) window.location.href = "/admin/login.html";

    window.open(response.data, "_blank").focus();

}

GetCards();