const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { AdminController, TerminalController } = require("../controllers");
const { Admin } = require("../middleware");
const { Centers, Employees, Card } = require("../services");
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



// Authentication

router.post("/login", express.json(), Admin.Login);
router.use(cookieParser());
router.use(Admin.ValidateCookie);

router.post("/uploadfile", upload.single("sheet"), (req, res) => {
    AdminController.AddEmployees(req.file.filename);
    res.redirect("/admin/index.html");
});

router.post("/setphoto/:id", photoupload.single("photo"), async (req, res) => {
    const id = req.params.id;
    const filename = req.file.filename;
    Card.ChangePhoto(await parseInt(id), filename);
    res.redirect("/admin/employees.html");
});

router.use(express.json());

// Number of employees currently working
router.post("/present", (req, res) => {
    res.send([AdminController.GetInside()]);
});

// Generate ID Cards
router.post("/card", async (req, res) => {
    const response = await AdminController.GenerateCard(req.body.employeeID);
    res.send([response]);
});

router.post("/cards", async (req, res) => {
    let cards = await AdminController.GenerateCards();
    res.send(cards);
});

router.post("/getcards", (req, res) => {
    res.send([Card.ZipIDCards()]);
});

// Generate Reports
router.post("/report", async (req, res) => {
    res.send([await AdminController.EmployeeReport(req.body.employeeID)]);
});

router.post("/reports", async (req, res) => {
    res.send([await AdminController.CenterReport(req.body.centerID)]);
});

// Add/remove/get Employee(s)

router.get("/getemployees", (req, res) => {
    res.send({ data: AdminController.GetEmployees() });
});

router.post("/addemployee", (req, res) => {
    res.send([AdminController.AddEmployee(req.body.name, req.body.center, req.body.subcenter, req.body.department)]);
});

router.get("/getemployeedata", (req, res) => {
    res.send([AdminController.GetEmployee(req.body.employeeID)]);
});

router.post("/deletemployee", (req, res) => {

});

// Get centers/subcenters/departments

router.post("/addcenter", (req, res) => {

});

router.get("/getcenters", (req, res) => {
    res.send(Centers.GetCenters());
});

router.get("/getcenter", (req, res) => {
    res.send([Centers.CenterName(req.body.centerID)]);
});

router.post("/getsubcenter", (req, res) => {
    res.send([Centers.SubcenterName(req.body.centerID, req.body.subcenterID)]);
});

router.post("/getdepartment", (req, res) => {
    res.send([Centers.DepartmentName(req.body.departmentID)]);
});

// Change password

router.post("/changeadminpass", (req, res) => {
    res.send([AdminController.ChangeAdminPassword(req.body.oldpass, req.body.newpass)]);
});

router.post("/changeterminalpass", (req, res) => {
    res.send([AdminController.ChangeTerminalPassword(req.body.oldpass, req.body.newpass)]);
});

module.exports = router;