const express = require("express");
const cookieParser = require("cookie-parser");
const { AdminController } = require("../controllers");
const { Centers, Employees, Card, Sessions } = require("../services");
const { User } = require("../middleware");
const router = express.Router();

router.post("/login", express.json(), User.Login);
router.use(cookieParser());
// router.use(User.ValidateCookie);

router.use(express.json());


router.get("/check", (req, res) => {
    res.send({ code: 0, msg: "Hi Admin!" });
});

// Number of employees currently working
router.get("/present", (req, res) => {
    res.send({ code: 0, data: Sessions.ActiveSessions() });
});

// Generate ID Cards
router.post("/card", async (req, res) => {
    const response = await AdminController.GenerateCard(req.body.employeeID);
    res.send([response]);
});

router.post("/cards", async (req, res) => {
    let cards = await AdminController.GenerateCards();
    res.send({ code: 0, data: cards });
});

router.post("/getcards", (req, res) => {
    res.send({ code: 0, data: Card.ZipIDCards() });
});

// Generate Reports
router.post("/report", async (req, res) => {
    res.send({ code: 0, data: await AdminController.EmployeeReport(req.body.employeeID) });
});

router.post("/reports", async (req, res) => {
    res.send({ code: 0, data: await AdminController.CenterReport(req.body.centerID) });
});

// Add/remove/get Employee(s)

router.get("/getemployees", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: AdminController.GetEmployees() });
});

router.get("/getemployeesdata", (req, res) => {
    res.send({ code: 0, msg: "Succeful request.", data: Employees.AllEmployeeData() });
});

router.post("/getemployeedata", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: AdminController.GetEmployee(req.body.employeeID) });
});

router.post("/getemployeedatafromcenter", (req, res) => {
    let = response = Employees.CenterEmployeeData(req.body.centername);
    if (!response) res.send({ code: -2, msg: "Something went wrong" });
    res.send({ code: 0, msg: "Successful request.", data: response });
});

router.post("/getemployeedatafromdepartment", (req, res) => {
    let = response = Employees.DepartmentEmployeedata(req.body.departmentname);
    if (!response) res.send({ code: -2, msg: "Something went wrong" });
    res.send({ code: 0, msg: "Successful request.", data: response });
});

router.get("/getcenters", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.GetCenters() });
});

router.get("/getallsubcenters", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.GetAllSubCenters() });
});

router.post("/getsubcenters", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.GetSubCenters(req.body.centerID) });
});

router.get("/getdepartments", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.GetDepartments() });
});

router.post("/getcenter", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.CenterName(req.body.centerID) });
});

router.post("/getsubcenter", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.SubcenterName(req.body.centerID, req.body.subcenterID) });
});

router.post("/getdepartment", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Centers.DepartmentName(req.body.departmentID) });
});


module.exports = router;