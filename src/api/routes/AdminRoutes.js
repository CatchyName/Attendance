const express = require("express");
const multer = require("multer");
const jimp = require("jimp");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const { AdminController } = require("../controllers");
const { Admin } = require("../middleware");
const { Centers, Employees, Card, Sessions, Report } = require("../services");
const router = express.Router();

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
    let filename = req.file.filename;
    if (!filename) {
        res.redirect("/admin/employees.html");
        return;
    }
    const image = await jimp.read(path.resolve(__dirname, "../data/Photos/" + filename));
    filename = path.parse(filename).name + ".png";
    await image.writeAsync(path.resolve(__dirname, "../data/Photos/" + filename));
    Card.ChangePhoto(await parseInt(id), filename);
    res.redirect("/admin/employees.html");
});

router.use(express.json());

// Check session

router.get("/check", (req, res) => {
    res.send({ code: 0, msg: "Hi Admin!" });
});

// Number of employees currently working
router.get("/present", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.ActiveSessions() });
});

router.get("/sessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.ActiveEmployees() });
});

router.post("/departmentsessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.DepartmentSessions(req.body.departmentID) });
});

router.post("/centersessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.CenterSessions(req.body.centerID) });
});

router.post("/subcentersessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.SubcenterSessions(req.body.centerID, req.body.subcenterID) });
});

router.post("/gendersessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.GenderSessions(req.body.gender) });
});

router.post("/daysessions", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: Sessions.DaySessions(req.body.date) });
});

// Generate ID Cards
router.post("/card", async (req, res) => {
    const response = await AdminController.GenerateCard(req.body.employeeID);
    res.send({ code: 0, data: response });
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
    res.send({ code: 0, data: await Report.EmployeeReport(req.body.employeeID) });
});

router.post("/reports", async (req, res) => {
    res.send({ code: 0, data: await Report.CenterReport(req.body.centerID) });
});

router.post("/subcenterreport", async (req, res) => {
    res.send({ code: 0, data: await Report.SubcenterReport(req.body.centerID, req.body.subcenterID) });
});

router.post("/departmentreport", async (req, res) => {
    res.send({ code: 0, data: await Report.DepartmentReport(req.body.departmentID) });
});


// Add/remove/get Employee(s)

router.get("/getemployees", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: AdminController.GetEmployees() });
});

router.get("/getemployeesdata", (req, res) => {
    res.send({ code: 0, msg: "Succeful request.", data: Employees.AllEmployeeData() });
});

router.post("/addemployee", (req, res) => {
    const response = AdminController.AddEmployee(req.body.name, req.body.center, req.body.subcenter, req.body.department, req.body.idno, req.body.sowo, req.body.gender, req.body.zoneno, req.body.zonedepartment, req.body.contactno, req.body.blood);
    res.send({ code: 0, msg: "Employee added successfully.", data: { employeeID: response } });
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

router.post("/deleteemployee", (req, res) => {
    res.send({ code: 0, msg: "Successful request.", data: AdminController.DeleteEmployee(req.body.employeeID) });
});

// Get centers/subcenters/departments

router.post("/addcenter", (req, res) => {
    const centername = req.body.center;
    if (!centername || centername === "") {
        res.send({
            code: 1,
            msg: "Invalid center name."
        });
    } else {
        const center = Centers.FindCenter(centername);
        if (center) {
            res.send({
                code: 1,
                msg: `Center already exists with ID ${center}.`
            });
        } else {
            const centerID = Centers.AddCenter(centername);
            res.send({
                code: 0,
                msg: `Created a center with ID ${centerID}`
            });
        }
    }
});

router.post("/addsubcenter", (req, res) => {
    const centerID = req.body.center;
    const subname = req.body.subname;

    if (!centerID || !subname) {
        res.send({ code: 1, msg: "Invalid center name." });
        return;
    }

    const center = Centers.CenterName(centerID);
    if (!center) {
        res.send({ code: 1, msg: "Center does not exist." });
        return;
    }

    if (!subname || subname === "") {
        res.send({ code: 1, msg: "Empty subcenter name." });
        return;
    }

    const subcenter = Centers.FindSubcenter(centerID, subname);
    if (subcenter) {
        res.send({ code: 1, msg: `Subcenter already exists with ID ${subcenter}` });
        return;
    }

    const subID = Centers.AddSubCenter(centerID, subname);
    res.send({ code: 0, msg: `Created a subcenter with ID ${subID}` });

});

router.post("/adddepartment", (req, res) => {
    const departmentname = req.body.department;

    if (!departmentname || departmentname === "") {
        res.send({ code: 1, msg: "Invalid department name." });
        return;
    }

    const department = Centers.FindDepartment(departmentname);
    if (department) {
        res.send({ code: 1, msg: `Department exists with ID ${department}` });
        return;
    }

    const departmentID = Centers.AddDepartment(departmentname);
    res.send({
        code: 0,
        msg: `Created a deaprtment with ID ${departmentID}`
    });

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

// Change password

router.post("/changeadminpass", (req, res) => {
    const response = AdminController.ChangeAdminPassword(req.body.oldpass, req.body.newpass)
    if (response) {
        res.send({ code: 0, msg: "Admin password changed successfully." });
    } else {
        res.send({ code: 1, msg: "Wrong password." });
    }
});

router.post("/changeuserpass", (req, res) => {
    const response = AdminController.ChangeUserPassword(req.body.oldpass, req.body.newpass)
    if (response) {
        res.send({ code: 0, msg: "User password changed successfully." });
    } else {
        res.send({ code: 1, msg: "Wrong password." });
    }
});

router.post("/changeterminalpass", (req, res) => {
    const response = AdminController.ChangeTerminalPassword(req.body.oldpass, req.body.newpass)
    if (response) {
        res.send({ code: 0, msg: "Terminal password changed successfully." });
    } else {
        res.send({ code: 1, msg: "Wrong password." });
    }
});

router.get('/cleareverythingiamsurejustdoit', (req, res) => {
    AdminController.FactoryReset();
    res.send("Done");
});

module.exports = router;