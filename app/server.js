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
app.use("/user", userRoute);

app.use(express.static(path.join(__dirname, "public")));

// Login route
app.get("/login", (req, res) => {
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

const getUserPromise = require("./controllers/UserController").getUserPromise;
app.get("/profile", authenticateJWT, async (req, res) => {
    const username = req.user.username;
    try {
        const user = await getUserPromise(username);
        res.render("profile", {
            username,
            isAdmin: user.role === "admin",
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.redirect("/login");
    }
});

// Default route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Démarrage du serveur
const port = process.env.PORT || 443;
https.createServer(options, app).listen(port, () => {
    console.log(`Server running on port https://localhost:${port}`);
});
