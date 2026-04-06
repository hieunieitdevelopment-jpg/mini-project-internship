const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/** 
* @param {string} to 
* @param {string} token
*/

exports.sendPasswordResetEmail = async (to, token) => {
    const resetLink = `http://3.26.153.101/reset-password?token=${token}`;
    const templatePath = path.join(__dirname, "../templates/resetPassword.html");
    let html = fs.readFileSync(templatePath, "utf-8");
    html = html.replace(/\{\{resetLink\}\}/g, resetLink);
    const mailOptions = {
        from: `"Tra cứu hành chính Việt Nam" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Đặt lại mật khẩu - Tra cứu hành chính Việt Nam",
        html,
    };
    await transporter.sendMail(mailOptions);
};
    