const content = document.getElementById("content");
const form = document.getElementById("form");
const ids = document.getElementById("ids");
const err = document.getElementById("err");

form.onsubmit = async (e) => {
    e.preventDefault();

    let string = ids.value;
    string = string.replace(/\s/g, '');
    let idsvalue = string.split(",");
    let wrong = false;
    for (let i = 0; i < idsvalue.length; i++) {
        const id = parseInt(idsvalue[i]);
        if (isNaN(id) || id < 0 || id > 999999) {
            wrong = true;
            break;
        }
    }

    if (wrong) {
        ids.value = "";
        err.innerHTML = "Wrong ID";
    } else {
        err.innerHTML = "";
        GetManualCards(idsvalue);
    }
}

const GetManualCards = async (cardIDs) => {
    content.innerHTML = "";
    for (let i = 0; i < cardIDs.length; i++) {
        let response = await fetch("/admin/card", {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employeeID: cardIDs[i]
            })
        }).then(res => res.json());
        console.log(response);
        if (response.code === -1) window.location.href = "/admin/login.html";
        if (response.data === false) continue;
        content.innerHTML += "<img class='card' src=" + response.data + ">";
    }

}

CheckSession();