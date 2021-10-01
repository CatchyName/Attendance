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
    const photo = await loadImage(path.resolve(__dirname, "../public/photos/" + employeeID + ".png"));
    Barcode.GenerateBarcode(employeeID);
    const barcode = await loadImage(path.resolve(__dirname, "../public/barcodes/" + employeeID + ".png"));

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, 119, 100, 400, 400);
    ctx.drawImage(barcode, 169, 800, 300, 200);
    ctx.fillStyle = "black";
    ctx.font = '32px Arial'

    ctx.fillText(employee.name, 119, 570);
    ctx.fillText(Centers.SubcenterName(employee.center, employee.subcenter) + "(" + Centers.CenterName(employee.center) + ")", 119, 670);
    ctx.fillText(Centers.DepartmentName(employee.department), 119, 770);

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

module.exports = {
    CreateID,
    ZipIDCards
}