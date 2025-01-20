const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// SSL options
const options = {
    key: fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.crt"),
};

const userRoute = require("./routes/User");
app.use("/user", userRoute);

app.use(express.static(path.join(__dirname, "public")));

// Login route
app.get("/login", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "pages", "login", "login.html")
    );
});

// Default route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Signup route
app.get("/signup", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "pages", "signup", "signup.html")
    );
});

// Démarrage du serveur
https.createServer(options, app).listen(443, () => {
    console.log("Server running on port https://localhost:443");
});
