const express = require("express");
const cron = require('node-cron');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { AdminController } = require("../controllers");
const { resolveSoa } = require("dns");
const router = express.Router();

// Send Report every month
// cron.schedule("0 0 1 * *", () => AdminController.SendReport()); 


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../data/Uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const filePhotoEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../data/Photos"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: fileStorageEngine });

const photoupload = multer({ storage: filePhotoEngine });

router.post("/uploadfile", upload.single("sheet"), (req, res) => {
    res.redirect("/admin/add.html" + "?filename=" + req.file.filename);
});

router.post("/uploadphoto", upload.single("photo"), (req, res) => {
    res.redirect("/admin/index.html");
});

router.use(express.json());

// Authentication
router.post("/login", (req, res) => {
    const response = AdminController.Login(req.body.password);
    res.send([response]);
});

// Number of employees currently working
router.post("/present", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    res.send([AdminController.GetInside()]);
});


// Generate ID Cards
router.post("/card", async (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    const response = AdminController.GenerateCard(req.body.employeeID);
    res.send([response]);
});

router.post("/cards", async (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    let cards = await AdminController.GenerateCards();
    res.send(cards);
});

// Generate Reports
router.post("/report", async (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    res.send([await AdminController.EmployeeReport(req.body.employeeID)]);
});

router.post("/reports", async (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    res.send([await AdminController.CenterReport(req.body.centerID)]);
});

// Add Employee(s)
router.post("/addemployee", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }

    res.send([AdminController.AddEmployee(req.body.name, req.body.center, req.body.subcenter, req.body.department)]);
});

router.post("/addemployees", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }

    AdminController.AddEmployees(req.body.filename);

    res.send([0]);
});

router.post("/uploadedFiles", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    const files = fs.readdirSync(path.resolve(__dirname, "../data/Uploads"));
    res.send(files);
});

// Change password

router.post("/changeadminpass", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    res.send([AdminController.ChangeAdminPassword(req.body.oldpass, req.body.newpass)]);
});

router.post("/changeterminalpass", (req, res) => {
    if (!AdminController.CheckSession(req.body.sessionID)) {
        res.send([-1]);
        return;
    }
    res.send([AdminController.ChangeTerminalPassword(req.body.oldpass, req.body.newpass)]);
});

module.exports = router;