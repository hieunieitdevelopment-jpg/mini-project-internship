const nodemailer = require("nodemailer");

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
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Tra cứu hành chính" <${process.env.EMAIL_USER}>`,
        to,
        subject: " đặt lại mật khẩu",
        html: `<h2>Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link dưới đây để đặt lại mật khẩu:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link này sẽ hết hạn sau 15 phút</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</p>
        `,  
    };
    await transporter.sendMail(mailOptions);
};
    