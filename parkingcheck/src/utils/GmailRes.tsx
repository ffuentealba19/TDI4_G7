const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Corregido el nombre del host
    port: 465, // Puerto correcto para SSL
    secure: true, // Usar SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

module.exports = transporter