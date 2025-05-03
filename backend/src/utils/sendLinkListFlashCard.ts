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
export const sendLinkListFlashCard = async (email: string, link: string , list_name: string) => {
  try {
    const mailOptions = {
      from: `"ITKOTOBA" <${process.env.SMTP_USER}>`, // Email gửi đi
      to: email, // Email người nhận
      subject: "Share Link List Flashcard",
      text: `Link list flashcard: ${link}. Xin vui lòng truy cập vào link để thêm ${list_name} vào danh sách của bạn`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Link list flashcard sent successfully!");
  } catch (error) {
    console.error("Error sending link list flashcard:", error);
  }
};
