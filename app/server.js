const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const {
    authenticateJWT,
    redirectIfAuthenticated,
} = require("./middleware/auth");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine and point to the views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "pages", "profile"));

// SSL options
const options = {
    key: fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.crt"),
};

const userRoute = require("./routes/User");
app.use("/api/users", userRoute);

app.use(express.static(path.join(__dirname, "public")));

// Login route
app.get("/login", redirectIfAuthenticated, (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "pages", "login", "login.html")
    );
});

// Signup route
app.get("/signup", redirectIfAuthenticated, (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "pages", "signup", "signup.html")
    );
});

// Profile route
const userController = require("./controllers/UserController");
app.get("/profile", authenticateJWT, userController.profile);

// Default route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Démarrage du serveur
const port = process.env.PORT || 443;
https.createServer(options, app).listen(port, () => {
    console.log(`Server running on port https://localhost:${port}`);
});
