const sha256 = require("sha256");
const path = require("path");
const fs = require("fs");

const GetAdminPassword = () => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    return info.admin;
}

const GetTerminalPassword = () => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    return info.admin;
}

const SetAdminPassword = (oldpass, newpass) => {
    let info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    if (info.admin !== sha256(oldpass)) return false;
    info.admin = sha256(newpass);
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

const GetInside = () => {
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    return info.inside;
}

const SetInside = (inside) => {
    let info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/info.json")));
    info.inside = inside;
    fs.writeFileSync(path.resolve(__dirname, "../data/info.json"), JSON.stringify(info, null, "\t"));
    return info.inside;
}

module.exports = {
    GetAdminPassword,
    GetTerminalPassword,
    SetAdminPassword,
    SetTerminalPassword,
    GetInside,
    SetInside,
}