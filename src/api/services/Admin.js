const { v4: uuidv4 } = require("uuid");
const sha256 = require("sha256");
const Info = require("./Info");
let sessions = {};

const GetInside = () => {
    return Info.GetInside();
}

const SetInside = (n) => {
    return Info.SetInside(n);
}

const Login = (password) => {

    if (sha256(password) !== Info.GetAdminPassword()) return false;

    const sessionID = uuidv4();
    sessions[sessionID] = Date.now();
    return sessionID;
}

const CheckSession = (sessionID) => {
    const session = sessions[sessionID];

    if (session) return true;
    else return false;
}

const ChangeTerminalPassword = (oldpass, newpass) => {
    return Info.SetTerminalPassword(oldpass, newpass);
}

const ChangeAdminPassword = (oldpass, newpass) => {
    return Info.SetAdminPassword(oldpass, newpass);
}

module.exports = {
    GetInside,
    SetInside,
    Login,
    CheckSession,
    ChangeAdminPassword,
    ChangeTerminalPassword
}