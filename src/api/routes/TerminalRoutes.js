const express = require("express");
const router = express.Router();
const { TerminalController } = require("../controllers");
const { Centers } = require("../services");
const GenerateBarcode = require("../services/GenerateBarcode");

router.use(express.json());

router.post("/login", (req, res) => {
    const response = TerminalController.Login(req.body.password);
    res.send([response]);
});

router.get("/centers", (req, res) => {
    res.send(TerminalController.Terminals());
});

router.post("/scan", (req, res) => {

    if (TerminalController.CheckSession(req.body.sessionID)) {
        let center = Centers.CenterName(req.body.centerID);
        if (center) {
            const employeeID = parseInt(req.body.employeeID);

            if (!employeeID || employeeID < 10000 || employeeID > 999999 || employeeID < 0) {
                res.send({ code: -2, msg: "Invalaid employee ID" });
            } else {
                res.send(TerminalController.Scan(employeeID, center));
            }

        } else {
            res.status(404);
            res.send({ code: -3, msg: "Center not found" });
            return;
        }

    } else {
        res.status(401);
        res.send({ code: -4, msg: "Invalid Session" });
        return;
    }

});

module.exports = router;