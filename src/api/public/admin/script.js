const sessionID = localStorage.getItem("sessionID");

if (!sessionID) window.location = "/admin/login.html";