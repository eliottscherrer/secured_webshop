const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("./middleware/auth");

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
app.get("/login", (req, res) => {
    // If there's a token in cookies, try to verify it
    const token = req.cookies.token;

    if (token) {
        try {
            // If token is valid (not expired, correct signature), redirect
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect("/profile");
        } catch (err) {
            // Token invalid or expired, so just continue to show the login page
        }
    }

    // Show the login page if no valid token
    res.sendFile(
        path.join(__dirname, "public", "pages", "login", "login.html")
    );
});

// Signup route
app.get("/signup", (req, res) => {
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
