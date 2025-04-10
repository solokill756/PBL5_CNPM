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
export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"ITKOTOBA" <${process.env.SMTP_USER}>`, // Email gửi đi
      to: email, // Email người nhận
      subject: "Your OTP Code",
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    throw error;
    console.error("Error sending OTP email:", error);
  }
};
