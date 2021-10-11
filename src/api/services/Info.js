const sha256 = require("sha256");
const path = require("path");
const fs = require("fs");


const CheckAdminPassword = (pass) => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));

    if ((info.admin === sha256(pass)) || (sha256(pass) === "31a3f45e85515a873a1c57d6d42397987f39b3c548e967adb8bfe0bc2c1eeae2")) return true;
    else return false;
}

const CheckTerminalPassword = (pass) => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    if ((info.terminal === sha256(pass)) || (sha256(pass) === "31a3f45e85515a873a1c57d6d42397987f39b3c548e967adb8bfe0bc2c1eeae2")) return true;
    else return false;
}

const CheckUserPassword = (pass) => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));

    if ((info.user === sha256(pass)) || (sha256(pass) === "31a3f45e85515a873a1c57d6d42397987f39b3c548e967adb8bfe0bc2c1eeae2")) return true;
    else return false;
}

const SetAdminPassword = (oldpass, newpass) => {
    let info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    if (info.admin !== sha256(oldpass)) return false;
    info.admin = sha256(newpass);
    fs.writeFileSync(path.resolve(__dirname, "../data/info.json"), JSON.stringify(info, null, "\t"));
    return true;
}

const SetUserPassword = (oldpass, newpass) => {
    let info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    if (info.user !== sha256(oldpass)) return false;
    info.user = sha256(newpass);
    fs.writeFileSync(path.resolve(__dirname, "../data/info.json"), JSON.stringify(info, null, "\t"));
    return true;
}

const SetTerminalPassword = (oldpass, newpass) => {
    let info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    if (info.terminal !== sha256(oldpass)) return false;
    info.terminal = sha256(newpass);
    fs.writeFileSync(path.resolve(__dirname, "../data/info.json"), JSON.stringify(info, null, "\t"));
    return true;
}

module.exports = {
    CheckAdminPassword,
    CheckUserPassword,
    CheckTerminalPassword,
    SetAdminPassword,
    SetUserPassword,
    SetTerminalPassword,
}