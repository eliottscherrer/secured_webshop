const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // NEW
const dotenv = require("dotenv");
const path = require("path");
const { hashPasswordManual, hashPassword } = require("../utils/hashingUtils");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PEPPER = process.env.PEPPER || "onglieronglieronglieronglier";
const HASH_METHOD = process.env.HASH_METHOD || "bcrypt";
// Use a secret from the environment or a fallback:
const JWT_SECRET = process.env.JWT_SECRET || "onglieronglieronglieronglier";

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_securewebshop",
    port: 6033,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to MySQL.");
    }
});

const getUserPromise = (username) => {
    return new Promise((resolve, reject) => {
        if (!username) {
            return reject(new Error("Username is required."));
        }

        const query =
            "SELECT user_id, username, role, created_at FROM t_users WHERE username = ?";
        db.query(query, [username], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return reject(new Error("User not found."));
            }
            resolve(results[0]);
        });
    });
};

const getUser = (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }

    const query =
        "SELECT user_id, username, role, created_at FROM t_users WHERE username = ?";
    db.query(query, [username], (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Database error.", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ user: results[0] });
    });
};

const signupUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }

    try {
        let hashedPassword, salt;

        if (HASH_METHOD === "bcrypt") {
            // If using bcrypt
            hashedPassword = await bcrypt.hash(password + PEPPER, 10);
        } else {
            // If using manual hashing
            const { hashedPassword: manualHash, salt: manualSalt } =
                await hashPassword(password);
            hashedPassword = manualHash;
            salt = manualSalt;
        }

        // Insert user into the database
        const query =
            "INSERT INTO t_users (username, password_hash, password_salt) VALUES (?, ?, ?)";
        db.query(
            query,
            [username, hashedPassword, salt || ""],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res
                            .status(400)
                            .json({ message: "Username already exists." });
                    }
                    return res
                        .status(500)
                        .json({ message: "Database error.", error: err });
                }

                // Generate JWT token on signup to auto-login
                const token = jwt.sign({ username }, JWT_SECRET, {
                    expiresIn: "1h",
                });

                // Set the token in an HTTP-only cookie
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                res.status(201).json({
                    message: "User created successfully and logged in!",
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Server error.", error });
    }
};

const loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }

    const query =
        "SELECT password_hash, password_salt FROM t_users WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Database error.", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const { password_hash: storedHash, password_salt: storedSalt } =
            results[0];

        let isMatch = false;

        // Check if the password is hashed with bcrypt
        if (!storedSalt) {
            isMatch = await bcrypt.compare(password + PEPPER, storedHash);
        } else {
            // If using manual hashing, compare manually hashed values
            const hashedPassword = hashPasswordManual(password, storedSalt);
            isMatch = storedHash === hashedPassword;
        }

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token on login
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({
            message: "Login successful!",
            username: username,
        });
    });
};

const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};

const searchUsersPromise = (searchTerm) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM t_users
            WHERE username LIKE ?
        `;
        db.query(query, [`%${searchTerm}%`], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const profile = async (req, res) => {
    try {
        const username = req.user.username;
        const user = await getUserPromise(username);
        const isAdmin = user.role === "admin";

        // If there's a "search" query param, and user is admin, do a search
        const searchTerm = req.query.search;
        let userResults = null; // default, so we can distinguish from '[]'

        if (isAdmin && searchTerm) {
            userResults = await searchUsersPromise(searchTerm);
        }

        res.render("profile", {
            username,
            isAdmin,
            users: userResults, // array or null
        });
    } catch (error) {
        console.error("Error loading profile:", error);
        return res.redirect("/login");
    }
};

module.exports = {
    getUserPromise,
    getUser,
    signupUser,
    loginUser,
    logoutUser,
    profile,
};
