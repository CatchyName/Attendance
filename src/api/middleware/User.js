const { Info } = require("../services/");
const { v4: uuidv4 } = require("uuid");
let sessions = {};

const Login = (req, res, next) => {
    if (req.body.password) {
        if (Info.CheckUserPassword(req.body.password)) {
            const usersessionID = uuidv4();
            sessions[usersessionID] = Date.now();
            res.cookie("usersessionID", usersessionID);
            console.log(`[User Middleware] message: login`);
            res.status(200).send({ code: 0, msg: "Logged in." })
        } else {
            console.log(`[User Middleware] message: wrong_password`);
            res.status(403).send({ code: -1, msg: "Wrong Password." });
        }
    } else {
        console.log(`[User Middleware] message: no_password`);
        res.status(403).send({ code: -1, msg: "No password supplied." });
    }
}

const ValidateCookie = (req, res, next) => {
    const { cookies } = req;
    if ("usersessionID" in cookies) {
        if (sessions[cookies.usersessionID]) {
            next();
        } else {
            console.log(`[User Middleware] message: wrong_session`);
            res.status(403).send({ code: -1, msg: "Invalid session ID." });
        }
    } else {
        console.log(`[User Middleware] message: no_session`);
        res.status(403).send({ code: -1, msg: "Cannot Authenticate." });
    }
}

module.exports = {
    Login,
    ValidateCookie,
}