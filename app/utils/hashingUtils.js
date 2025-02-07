const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const HASH_METHOD = process.env.HASH_METHOD || "bcrypt";

const generateSaltManual = (length = 16) => {
    let salt = "";

    for (let i = 0; i < length; i++) {
        salt += String.fromCharCode(Math.floor(Math.random() * 256));
    }

    return salt;
};

const simpleHash = (input) => {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i); // Simple hash formula
        hash |= 0; // Convert to 32-bit integer
    }

    hash ^= 0xaaaaaaaa;
    hash = hash >>> 0;
    hash *= 2654435761;
    hash **= 12;
    hash += 0xdeadbeef;

    return hash.toString(16); // Return the hexadecimal representation
};

// Hash the password with the salt
const hashPasswordManual = (password, salt) => {
    const saltedPassword = password + salt;
    return simpleHash(saltedPassword);
};

const verifyPasswordManual = (inputPassword, storedHash, storedSalt) => {
    const hash = hashPassword(inputPassword, storedSalt);
    return hash === storedHash;
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
