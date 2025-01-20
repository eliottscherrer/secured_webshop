const mysql = require("mysql2");

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
    res.send("User: Sarah Test");
    // TODO: Add unique profile page for users
};

const signupUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }

    try {
        // TODO: hash the password before inserting in database

        // Insert user into the database
        const query =
            "INSERT INTO t_users (username, password_hash) VALUES (?, ?)";
        db.query(query, [username, password], (err, result) => {
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

module.exports = { getUser, signupUser };
