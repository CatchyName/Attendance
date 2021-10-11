const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const { AdminRoutes, TerminalRoutes, UserRoutes } = require("./routes/");
const { Sessions } = require("./services/");

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", AdminRoutes);
app.use("/user", UserRoutes);
app.use("/terminal", TerminalRoutes);

Sessions.LoadSessions();

app.get("/", (req, res) => {
    res.send("Attendance server is running!");
});

module.exports = app;