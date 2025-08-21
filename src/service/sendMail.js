// @@ external module
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

/**
 * @send mail
 * @param {string} to
 * @param {string} subject
 * @param {string} html mail template
 * 
*/


async function sendMail(to,subject,html){
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
}


module.exports = sendMail;