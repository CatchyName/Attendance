const JsBarcode = require("jsbarcode");
const { createCanvas, } = require("canvas");
const Employees = require("./Employees");
const path = require("path");
const fs = require("fs");

const GenerateBarcode = employeeID => {
    const employee = Employees.GetEmployee(employeeID);

    if (!employee) return false;

    const canvas = createCanvas();
    JsBarcode(canvas, employeeID.toString());

    fs.writeFileSync(path.resolve(__dirname, "../public/barcodes/" + employeeID + ".png"), canvas.toBuffer('image/png'));
    return "/barcodes/" + employeeID + ".png";
}

module.exports = {
    GenerateBarcode,
}