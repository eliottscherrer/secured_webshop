const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password before inserting in database
        // TODO: Make it the manual way
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const query =
            "INSERT INTO t_users (username, password_hash, password_salt) VALUES (?, ?, ?)";
        db.query(query, [username, hashedPassword, salt], (err, result) => {
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

            res.status(201).json({ message: "User created successfully!" });
        });
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

        const passwordHash = results[0].password_hash;
        const salt = results[0].password_salt;

        // Hash the provided password with the stored salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // TODO: Make it the manual way
        // Compare hashed password (stored in DB) with the hashed provided password
        if (hashedPassword !== passwordHash) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        res.status(200).json({
            message: "Login successful!",
            username: username,
        });
    });
};

module.exports = { getUser, signupUser, loginUser };
