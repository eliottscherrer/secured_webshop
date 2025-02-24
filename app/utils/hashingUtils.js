const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const HASH_METHOD = process.env.HASH_METHOD || "bcrypt";

const generateSaltManual = (length = 16) => {
    let salt = "";

    for (let i = 0; i < length; i++) {
        salt += String.fromCharCode(Math.floor(Math.random() * 94) + 33); // Printable ASCII range (33-126)
    }

    return salt;
};

const simpleHash = (input) => {
    let hash1 = 0xdeadbeef;
    let hash2 = 0x41c6ce57;

    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        hash1 = (hash1 << 5) - hash1 + charCode;
        hash1 |= 0;
        hash2 = (hash2 << 7) ^ charCode;
        hash2 |= 0;
    }

    let finalHash =
        (hash1 >>> 0).toString(16).padStart(8, "0") +
        (hash2 >>> 0).toString(16).padStart(8, "0") +
        ((hash1 * hash2) >>> 0).toString(16).padStart(8, "0") +
        ((hash1 ^ hash2) >>> 0).toString(16).padStart(8, "0");

    return finalHash;
};

// Hash the password with the salt
const hashPasswordManual = (password, salt) => {
    return simpleHash(password + salt);
};

const verifyPasswordManual = (inputPassword, storedHash, storedSalt) => {
    return hashPassword(inputPassword, storedSalt) === storedHash;
};

const hashPassword = async (password) => {
    if (HASH_METHOD === "bcrypt") {
        return await bcrypt.hash(password + PEPPER, 10);
    } else {
        const salt = generateSaltManual();
        const hashedPassword = hashPasswordManual(password, salt);
        return { hashedPassword, salt };
    }
};

module.exports = {
    generateSaltManual,
    hashPasswordManual,
    verifyPasswordManual,
    hashPassword,
};
