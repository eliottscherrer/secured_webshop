const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "onglieronglieronglieronglier";

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect("/login");
        }

        req.user = decoded;
        next();
    });
};

const redirectIfAuthenticated = (req, res, next) => {
    const token = req.cookies?.token;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.redirect("/profile");
        } catch (err) {
            // Token invalide ou expiré, on continue normalement
        }
    }

    next();
};

module.exports = { authenticateJWT, redirectIfAuthenticated };
