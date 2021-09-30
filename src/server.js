require("dotenv").config();
const { networkInterfaces } = require("os");
const app = require("./api/app");
const port = process.env.PORT || 80;

const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === "IPv4" && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

app.listen(port, () => {
    console.log("Attendance server is running");
    for (let ip in results) {
        console.log(results[ip] + ":" + port);
    }
});