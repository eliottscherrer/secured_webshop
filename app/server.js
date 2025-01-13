const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

const options = {
    key: fs.readFileSync("certs/key.pem"),
    cert: fs.readFileSync("certs/cert.crt")
};

const userRoute = require('./routes/User');
app.use('/user', userRoute);

// Démarrage du serveur
https.createServer(options, app).listen(443, () => {
    console.log("Server running on port https://localhost:443");
});