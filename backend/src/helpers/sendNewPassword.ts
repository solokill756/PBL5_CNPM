import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Đọc biến môi trường từ .env

// Cấu hình transporter để gửi email qua Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER, // Gmail của bạn
    pass: process.env.SMTP_PASS, // App Password từ Google
  },
});

// Hàm gửi OTP đến email
export const sendNewPasswordEmail = async (email: string, password: string) => {
  try {
    const mailOptions = {
      from: `"ITKOTOBA" <${process.env.SMTP_USER}>`, // Email gửi đi
      to: email, // Email người nhận
      subject: "Your new Password",
      text: `Password mới  của bạn là: ${password}. Xin mời bạn đăng nhập lại`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
