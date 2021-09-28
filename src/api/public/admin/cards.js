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
        body: JSON.stringify({
            sessionID: sessionID
        })
    }).then(res => res.json());

    if (response[0] === -1) window.location.href = "/admin/login.html";

    response.forEach(v => {
        content.innerHTML += "<img class='card' width='375' height='600' src=" + v + ">";
    });
}

GetCards();