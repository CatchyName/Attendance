const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");
const { createCanvas, loadImage } = require("canvas");
const Barcode = require("./GenerateBarcode");
const Centers = require("./Centers");
const Employees = require("./Employees");

const CreateID = async (employeeID) => {

    const employee = Employees.GetEmployee(employeeID);

    if (!employee) return false;

    if (employee.uuid) return "/cards/" + employee.uuid + ".png";

    const canvas = createCanvas(637.5, 1011);
    const ctx = canvas.getContext('2d');
    const logo = await loadImage(path.resolve(__dirname, "../data/Logo.png"));
    const photo = await loadImage(path.resolve(__dirname, "../public/photos/" + employeeID + ".png"));
    Barcode.GenerateBarcode(employeeID);
    const barcode = await loadImage(path.resolve(__dirname, "../public/barcodes/" + employeeID + ".png"));

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, 15, 15, 100, 120);
    ctx.drawImage(photo, 0, 0, photo.width, photo.height, 219, 325, 200, 270);
    ctx.drawImage(barcode, (637.5 - barcode.width) / 2, 835, barcode.width, barcode.height);
    ctx.fillStyle = "black";
    ctx.font = '35px sans-serif'
    ctx.fillText("RADHA SOAMI SATSANG BEAS", 125, 90);

    ctx.fillStyle = "#1d3d96";
    ctx.fillRect(0, 150, 637.5, 100);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "50px sans-serif";
    ctx.fillText(Centers.DepartmentName(employee.department), 320, 220);

    ctx.font = "35px sans-serif";
    ctx.fillStyle = "black"
    ctx.fillText(Centers.SubcenterName(employee.center, employee.subcenter) + " (" + Centers.CenterName(employee.center) + ")", 320, 300);

    ctx.fillText(employee.name, 320, 630);
    ctx.fillText("S/o. / W/o. " + employee.sowo, 320, 670);


    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.font = "25px sans-serif";
    ctx.fillText("ID no.", 80, 710);
    ctx.fillText("Zone Badge No.", 80, 740);
    ctx.fillText("Sewa at M. C.", 80, 770);
    ctx.fillText("Contact no.", 80, 800);
    ctx.fillText("Blood Group", 80, 830);

    ctx.fillText(employee.idno, 300, 710);
    ctx.fillText(employee.zoneno, 300, 740);
    ctx.fillText(employee.zonedepartment, 300, 770);
    ctx.fillText(employee.contactno, 300, 800);
    ctx.fillText(employee.blood, 300, 830);


    const cardID = uuidv4();
    employee.uuid = cardID;
    Employees.ChangeEmployee(employeeID, employee);
    fs.writeFileSync(path.resolve(__dirname, "../public/cards/" + cardID + ".png"), canvas.toBuffer('image/png'));

    return "/cards/" + cardID + ".png";

}

const ZipIDCards = () => {
    const zip = new AdmZip();
    const employees = Employees.Employees();
    for (let i = 0; i < employees.length; i++) {
        let employee = Employees.GetEmployee(employees[i]);
        if (!employee.uuid) {
            CreateID(employees[i]);
            i--;
            continue;
        }

        zip.addLocalFile(path.resolve(__dirname, "../public/cards/" + employee.uuid + ".png"));

    }

    const name = uuidv4() + ".zip";

    zip.writeZip(path.resolve(__dirname, "../public/cards/" + name));

    return "/cards/" + name;
}

const ChangePhoto = async (employeeID, filename) => {
    const employee = Employees.GetEmployee(employeeID);
    if (!employee) return false;

    fs.copyFileSync(path.resolve(__dirname, "../data/Photos/" + filename), path.resolve(__dirname, "../public/photos/" + employeeID + ".png"));

    employee.uuid = "";
    Employees.ChangeEmployee(employeeID, employee);
    await CreateID(employeeID);

    return true;

}


module.exports = {
    CreateID,
    ZipIDCards,
    ChangePhoto
}