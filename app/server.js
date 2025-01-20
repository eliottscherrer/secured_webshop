const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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
const port = process.env.PORT || 443;
https.createServer(options, app).listen(port, () => {
    console.log(`Server running on port https://localhost:${port}`);
});
